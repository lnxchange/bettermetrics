import assert from 'assert'
import {
  askPolicyForTags,
  noteForContactMessage,
  splitName,
  tagsForInterest
} from '../lib/crm/config'

assert.deepStrictEqual(splitName('Ada Lovelace'), {
  firstName: 'Ada',
  lastName: 'Lovelace'
})
assert.deepStrictEqual(splitName('Prince'), { firstName: 'Prince', lastName: '' })
assert.deepStrictEqual(tagsForInterest('media'), ['press', 'inbound'])
assert.deepStrictEqual(tagsForInterest('testing'), ['inbound'])
assert.deepStrictEqual(tagsForInterest('research'), ['inbound'])
assert.strictEqual(askPolicyForTags(['ally']), 'do-not-ask')
assert.strictEqual(askPolicyForTags(['reviewer']), 'may-ask-to-validate')
assert.ok(noteForContactMessage({ subject: 'Hello', message: 'There' }).includes('Hello'))
console.log('crm config tests passed')
