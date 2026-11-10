/**
 * Import a contact CSV into the CRM. The treatise list is not in this
 * checkout, so this is the import until that file can be read.
 *
 *   npx tsx scripts/import-crm-csv.ts path/to/contacts.csv
 *
 * Header:
 * external_id,first_name,last_name,email,company,title,tags,ask_policy,background
 *
 * tags are separated with |. ask_policy is may-ask-to-validate or do-not-ask.
 * Ally rows should use do-not-ask. The import refreshes identity fields and
 * leaves notes, tasks, deals, and locked_fields to the CRM.
 */
import { readFile } from 'fs/promises'
import { config } from 'dotenv'
import path from 'path'
import { upsertSyncedContact } from '../lib/crm/sync'

config({ path: path.join(process.cwd(), '.env.local') })

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"'
          i += 1
        } else {
          quoted = false
        }
      } else {
        cell += char
      }
      continue
    }
    if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else if (char !== '\r') {
      cell += char
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }
  return rows.filter(entry => entry.some(value => value.trim() !== ''))
}

async function main() {
  const file = process.argv[2]
  if (!file) {
    throw new Error('Pass the CSV path. See the header in this file.')
  }
  const rows = parseCsv(await readFile(file, 'utf8'))
  const [header, ...body] = rows
  if (!header) throw new Error('CSV is empty')
  const index = new Map(header.map((name, position) => [name.trim(), position]))
  const value = (row: string[], name: string) => row[index.get(name) ?? -1]?.trim() || null

  let imported = 0
  for (const row of body) {
    const tags = (value(row, 'tags') || '')
      .split('|')
      .map(tag => tag.trim())
      .filter(Boolean)
    const ask = value(row, 'ask_policy')
    const ok = await upsertSyncedContact({
      externalId: value(row, 'external_id'),
      firstName: value(row, 'first_name'),
      lastName: value(row, 'last_name'),
      email: value(row, 'email'),
      companyName: value(row, 'company'),
      title: value(row, 'title'),
      background: value(row, 'background'),
      source: value(row, 'source') || 'treatise-list',
      tagNames: tags,
      askPolicy:
        ask === 'do-not-ask' || ask === 'may-ask-to-validate' ? ask : null
    })
    if (ok) imported += 1
  }
  console.log(`Imported ${imported} of ${body.length} contacts`)
  if (imported !== body.length) process.exit(1)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
