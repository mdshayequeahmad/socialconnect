'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { apiFetch } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = async () => {
    try {
      await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      router.push('/feed')
    } catch (err: any) {
      if (err.message.includes('Email not confirmed')) {
        setError('Please confirm your email first.')
      } else {
        setError(err.message)
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button onClick={login} className="w-full">
            Login
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{' '}
            <span
              className="text-primary cursor-pointer"
              onClick={() => router.push('/register')}
            >
              Register
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}