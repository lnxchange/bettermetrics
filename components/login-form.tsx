'use client'

import * as React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { ConsentFields } from '@/components/consent-fields'
import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { Input } from './ui/input'
import { Label } from './ui/label'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface LoginFormProps extends React.ComponentPropsWithoutRef<'form'> {
  action: 'sign-in' | 'sign-up'
}

export function LoginForm({
  className,
  action = 'sign-in',
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()
  // Create a Supabase client configured to use cookies
  const supabase = createClientComponentClient()

  const [formState, setFormState] = React.useState({
    displayName: '',
    email: '',
    password: ''
  })
  const [updates, setUpdates] = React.useState(false)

  const signIn = async () => {
    const { email, password } = formState
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return error
  }

  const signUp = async () => {
    const response = await fetch('/api/account/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        displayName: formState.displayName,
        email: formState.email,
        password: formState.password,
        updatesOptIn: updates
      })
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) return { message: data.error || 'Could not create the account.' }
    if (data.needsConfirmation) toast.success('Check your inbox to confirm your email address!')
    return null
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const error = action === 'sign-in' ? await signIn() : await signUp()

    if (error) {
      setIsLoading(false)
      toast.error(error.message)
      return
    }

    setIsLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleOnSubmit} {...props}>
      {action === 'sign-up' && (
        <>
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            name="displayName"
            value={formState.displayName}
            onChange={e => setFormState(prev => ({ ...prev, displayName: e.target.value }))}
            required
          />
          <p className="mb-3 text-xs text-slate-500">Doesn&apos;t need to be your real name.</p>
        </>
      )}
      <Label>Email</Label>
      <Input
        name="email"
        type="email"
        value={formState.email}
        onChange={e =>
          setFormState(prev => ({
            ...prev,
            email: e.target.value
          }))
        }
      />

      <Label>Password</Label>
      <Input
        name="password"
        type="password"
        value={formState.password}
        onChange={e =>
          setFormState(prev => ({
            ...prev,
            password: e.target.value
          }))
        }
      />
      {action === 'sign-in' && (
        <div className="text-right mb-2">
          <Link href="/reset-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
      )}

      {action === 'sign-up' && (
        <div className="my-4">
          <ConsentFields updates={updates} onUpdates={setUpdates} />
        </div>
      )}

      <Button disabled={isLoading}>
        {isLoading && <IconSpinner className="mr-2 animate-spin" />}
        {action === 'sign-in' ? 'Sign In' : 'Sign Up'}
      </Button>

      <p>
        {action === 'sign-in' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="font-medium">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/sign-in" className="font-medium">
              Sign In
            </Link>
          </>
        )}
      </p>
    </form>
  )
}
