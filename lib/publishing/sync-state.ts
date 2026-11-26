import { createHash } from 'crypto'

/**
 * How a file sync decides whether the database copy is still the file.
 *
 * content_hash stores two sha256 hex digests separated by a dot:
 * the raw file that was last applied, then the title, summary and body
 * that were written from that file.
 *
 * An in-app edit changes the body and leaves content_hash alone, so the
 * stored body digest no longer matches the row. An approval leaves the
 * body digest alone and sets editorial_status to approved.
 *
 * If the file is unchanged, the sync writes nothing.
 * If the file changed and the row was edited in the app, or it is approved,
 * the sync does not write the body, the approval, or the slot. It reports
 * a conflict. The in-app copy and the slot stay as they are.
 * A stored slot is never replaced by a later file date.
 */
export class SyncState {
  static bodyHash(title: string, summary: string, body: string) {
    return createHash('sha256').update(`${title}\n${summary}\n${body}`).digest('hex')
  }

  static pack(fileHash: string, bodyHash: string) {
    return `${fileHash}.${bodyHash}`
  }

  static unpack(stored: string | null | undefined) {
    if (!stored) return { fileHash: null as string | null, bodyHash: null as string | null }
    const [fileHash, bodyHash, extra] = stored.split('.')
    if (extra === undefined && fileHash?.length === 64 && bodyHash?.length === 64) {
      return { fileHash, bodyHash }
    }
    if (/^[a-f0-9]{64}$/.test(stored)) return { fileHash: stored, bodyHash: null }
    return { fileHash: null, bodyHash: null }
  }

  /**
   * True when the row should not take text from a changed file.
   * A missing body digest (a hash written before this rule) is treated as
   * diverged when the file itself changed, so an older row is not clobbered.
   */
  static holds(input: {
    storedHash: string | null
    fileHash: string
    fileBodyHash: string
    dbBodyHash: string | null
    editorialStatus: string | null
  }) {
    const unpacked = SyncState.unpack(input.storedHash)
    if (unpacked.fileHash === input.fileHash) return false
    if (input.editorialStatus === 'approved') return true
    if (!unpacked.fileHash) {
      if (input.dbBodyHash === null) return false
      return input.dbBodyHash !== input.fileBodyHash
    }
    if (!unpacked.bodyHash) return true
    if (input.dbBodyHash === null) return true
    return unpacked.bodyHash !== input.dbBodyHash
  }
}
