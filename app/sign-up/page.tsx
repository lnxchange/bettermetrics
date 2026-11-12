import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { LoginForm } from '@/components/login-form'
import { Separator } from '@/components/ui/separator'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

function safeNext(value: string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

export default async function SignUpPage({
  searchParams
}: {
  searchParams?: { reason?: string; redirectedFrom?: string }
}) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-10">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Not Available
          </h1>
          <p className="text-gray-600 mb-6">
            The authentication service is being configured. Please check back soon.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect(safeNext(searchParams?.redirectedFrom))
  }
  const fromChat =
    searchParams?.reason === 'chat' || searchParams?.redirectedFrom?.startsWith('/chat')
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm">
        {fromChat && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              After your account is ready, add your API key on your profile. Questions are billed to that provider.
            </p>
          </div>
        )}
        <LoginForm action="sign-up" />
        <Separator className="my-4" />
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    </div>
  )
}
