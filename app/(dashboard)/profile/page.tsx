'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    getUser()
  }, [])

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setUploading(true)

      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUser((prev: any) => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          avatar_url: data.url,
        },
      }))

      e.target.value = ''
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex justify-center mt-10">
        <p>Loading...</p>
      </div>
    )
  }

  const name = user.user_metadata?.name || 'No name'
  const email = user.email
  const avatar = user.user_metadata?.avatar_url

  return (
    <div className="flex justify-center mt-10 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Profile
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative group w-24 h-24">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xl font-semibold">
                  {name.charAt(0)}
                </div>
              )}
            </div>

            {/* overlay */}
            <label
              htmlFor="avatarUpload"
              className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-full"
            >
              {uploading ? 'Uploading...' : 'Change'}
            </label>

            {/* hidden input */}
            <input
              id="avatarUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadAvatar}
            />
          </div>

          {/* fallback button */}
          <label htmlFor="avatarUpload" className="w-full">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Avatar'}
            </Button>
          </label>

          {/* user info */}
          <div className="text-center space-y-1">
            <p className="text-lg font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}