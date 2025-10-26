import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { LoginForm } from '@/components/login-form'
import { Separator } from '@/components/ui/separator'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function SignInPage({
  searchParams
}: {
  searchParams: { reason?: string; redirectedFrom?: string }
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
  
  if (session?.user) {
    const redirectTo = searchParams.redirectedFrom || '/'
    redirect(redirectTo)
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center py-10">
      <div className="w-full max-w-sm">
        {searchParams.reason === 'download-requires-auth' && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Please sign in to download research documents. This helps us maintain our researcher mailing list.
            </p>
          </div>
        )}
        <LoginForm action="sign-in" />
        <Separator className="my-4" />
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    </div>
  )
}
