'use client'

import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const router = useRouter()

  const logout = async () => {
  await supabase.auth.signOut()
  router.refresh() 
  router.push('/login')
}

  return (
    <nav className="border-b bg-background px-6 py-4 flex justify-between items-center">
      <h1
        className="font-bold text-lg cursor-pointer"
        onClick={() => router.push('/feed')}
      >
        SocialConnect
      </h1>

      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => router.push('/feed')}>
          Feed
        </Button>

        <Button variant="ghost" onClick={() => router.push('/profile')}>
          Profile
        </Button>

        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  )
}