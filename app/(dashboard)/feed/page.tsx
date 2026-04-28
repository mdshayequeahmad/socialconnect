'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import PostCard from '@/components/ui/PostCard'
import CreatePost from '@/components/ui/CreatePost'

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([])

  const fetchPosts = async () => {
    const data = await apiFetch('/api/feed')
    setPosts(data)
  }

  useEffect(() => {
    fetchPosts();
  }, [])

  return (
    <>
      <CreatePost refresh={fetchPosts} />

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </>
  )
}