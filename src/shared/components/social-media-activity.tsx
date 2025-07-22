'use client'

import { interBold, interMedium, interRegular } from '@/shared/styles/fonts'
import Avatar from './ui/avatar'
import { Card } from './ui/card'

interface SocialMediaPost {
  id: string
  name: string
  avatar: string
  time: string
  content: string
}

export function SocialMediaActivity() {
  const posts: SocialMediaPost[] = [
    {
      id: '1',
      name: 'Paul',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '2 Days ago',
      content: "I'm feeling so overwhelmed with everything right now. I don't...",
    },
    {
      id: '2',
      name: 'Ronke',
      avatar: '/placeholder.svg?height=32&width=32',
      time: 'Yesterday',
      content: 'I just want to disappear. Nothing seems to be going right, and...',
    },
    {
      id: '3',
      name: 'Bayowa',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '7 hours ago',
      content: "I can't sleep, I can't eat, and I can't focus. I feel like I'm trapped...",
    },
    {
      id: '4',
      name: 'Adesola',
      avatar: '/placeholder.svg?height=32&width=32',
      time: '22 hours ago',
      content: "Everything feels pointless lately. I'm struggling to find motivation...",
    },
  ]

  return (
    <Card>
      <div>
        <h1 className={`${interBold.className} text-[1.25rem] text-[#121417]`}>
          Social Media Activity
        </h1>
        <p className={`${interRegular.className} text-[0.875rem] text-[#667582]`}>
          Recent student posts on social media
        </p>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex items-start space-x-3 rounded-lg p-3 hover:bg-gray-50">
            <Avatar
              size={38}
              type="user"
              //   headerImage={user?.header_image}
              //   profilePicture={user?.thumbnail}
              customDefault="thumbnail" // ✅ Forces fallback to DefaultThumbnail on this page only
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-[1rem] ${interMedium.className} text-[#121417]`}>{post.name}</p>
                <span className={`${interRegular.className} text-[0.875rem] text-[#667582]`}>
                  {post.time}
                </span>
              </div>
              <p className={`${interRegular.className} text-[0.875rem] text-[#667582]`}>
                {post.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
