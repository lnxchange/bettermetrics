'use client'

import * as React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { Input } from './ui/input'
import { Label } from './ui/label'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { safeNextPath } from '@/lib/auth/session-cookie'

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
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })

  const signIn = async () => {
    const email = formState.email.trim()
    const { password } = formState
    // Finish any in-flight refresh of a dead cookie before starting a new
    // session. Otherwise that refresh fails and deletes the cookie we just set.
    await supabase.auth.initialize()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return error
  }

  const signUp = async () => {
    const { password, firstName, lastName } = formState
    const email = formState.email.trim()
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`
        }
      }
    })

    if (!error && data.session) {
      await fetch('/api/account/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName })
      })
    }

    if (!error && !data.session)
      toast.success('Check your inbox to confirm your email address!')
    return error
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
    if (action === 'sign-in') {
      const next = safeNextPath(
        new URLSearchParams(window.location.search).get('redirectedFrom')
      )
      router.replace(next)
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleOnSubmit} {...props}>
      {action === 'sign-up' && (
        <>
          <Label>First name</Label>
          <Input
            name="firstName"
            value={formState.firstName}
            onChange={e =>
              setFormState(prev => ({ ...prev, firstName: e.target.value }))
            }
            required
          />
          <Label>Last name</Label>
          <Input
            name="lastName"
            value={formState.lastName}
            onChange={e =>
              setFormState(prev => ({ ...prev, lastName: e.target.value }))
            }
            required
          />
        </>
      )}
      <Label>Email</Label>
      <Input
        name="email"
        type="email"
        autoComplete="email"
        value={formState.email}
        onChange={e =>
          setFormState(prev => ({
            ...prev,
            email: e.target.value
          }))
        }
        required
      />

      <Label>Password</Label>
      <Input
        name="password"
        type="password"
        autoComplete={
          action === 'sign-in' ? 'current-password' : 'new-password'
        }
        value={formState.password}
        onChange={e =>
          setFormState(prev => ({
            ...prev,
            password: e.target.value
          }))
        }
        required
      />
      {action === 'sign-in' && (
        <div className="mb-2 text-right">
          <Link
            href="/reset-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
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
