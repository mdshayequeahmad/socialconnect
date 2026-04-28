'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PostCard({ post }: any) {
  const [likes, setLikes] = useState(post.like_count || 0)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [post.id])

  const fetchComments = async () => {
    try {
      const data = await apiFetch(`/api/posts/${post.id}/comments`)
      setComments(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const like = async () => {
    const res = await apiFetch(`/api/posts/${post.id}/like`, {
      method: 'POST',
    })

    if (res.liked) {
      setLikes((prev) => prev + 1)
    } else {
      setLikes((prev) => prev - 1)
    }
  }

  const addComment = async () => {
    if (!newComment.trim()) return

    try {
      setLoading(true)

      const newC = await apiFetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment }),
      })

      setNewComment('')

      setComments((prev) => [newC, ...prev])
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        {/* user name */}
        <p className="font-semibold">{post.name}</p>

        {/* post content */}
        <p>{post.content}</p>

        {/* actions */}
        <div className="flex gap-4">
          <Button variant="ghost" onClick={like}>
            ❤️ {likes}
          </Button>

          <span className="text-muted-foreground">
            💬 {comments.length}
          </span>
        </div>

        {/* add comment */}
        <div className="flex gap-2">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={addComment} disabled={loading}>
            {loading ? '...' : 'Send'}
          </Button>
        </div>

        {/* comments list */}
        <div className="flex flex-col gap-2">
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No comments yet
            </p>
          )}

          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-muted p-2 rounded text-sm"
            >
              <p className="font-semibold">{c.name}</p>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}