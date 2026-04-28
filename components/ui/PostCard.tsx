'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type CommentType = {
  id: string
  content: string
  name: string
}

export default function PostCard({ post }: any) {
  const [likes, setLikes] = useState<number>(post.like_count || 0)
  const [liked, setLiked] = useState<boolean>(false)
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

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
    try {
      const res = await apiFetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })

      if (res.liked) {
        setLikes((prev) => prev + 1)
      } else {
        setLikes((prev) => prev - 1)
      }

      setLiked(res.liked)
    } catch (err) {
      console.error(err)
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
      <CardContent className="flex flex-col gap-4">
        <p className="font-semibold">{post.name}</p>

        <p>{post.content}</p>

        <div className="flex gap-4 items-center">
          <Button variant="ghost" onClick={like}>
            ❤️ {likes}
          </Button>

          <span className="text-sm text-muted-foreground">
            💬 {comments.length}
          </span>
        </div>

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