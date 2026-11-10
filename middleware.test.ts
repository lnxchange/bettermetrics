import assert from 'assert'
import { NextRequest } from 'next/server'
import { middleware } from './middleware'

process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:9'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

async function main() {
  const admin = await middleware(new NextRequest('https://aimtheory.org/admin'))
  const adminLocation = admin.headers.get('location')
  assert.equal(admin.status, 307)
  assert.ok(adminLocation)
  const adminUrl = new URL(adminLocation)
  assert.equal(adminUrl.pathname, '/sign-in')
  assert.equal(adminUrl.searchParams.get('redirectedFrom'), '/admin')

  const signIn = await middleware(new NextRequest(adminUrl))
  assert.equal(signIn.headers.get('location'), null)
  assert.ok(signIn.status < 400)

  const download = await middleware(
    new NextRequest(
      'https://aimtheory.org/sign-in?redirectedFrom=/api/documents/download'
    )
  )
  assert.equal(download.headers.get('location'), null)

  console.log('middleware sign-in tests passed')
}

main()
