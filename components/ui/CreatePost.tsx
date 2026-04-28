'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CreatePost({ refresh }: any) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!content.trim()) return

    try {
      setLoading(true)

      await apiFetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })

      setContent('')
      refresh?.()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <Textarea
          value={content}
          maxLength={280}
          placeholder="What's on your mind?"
          onChange={(e) => setContent(e.target.value)}
        />

        <Button
          onClick={submit}
          disabled={loading}
          className="self-end"
        >
          {loading ? 'Posting...' : 'Post'}
        </Button>
      </CardContent>
    </Card>
  )
}