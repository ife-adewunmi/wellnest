import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar as UserAvatar, AvatarFallback, AvatarImage } from '@/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Avatar from '@/shared/components/ui/avatar'
import { User } from '@/features/users/auth/types'

interface UserMenuProps {
  user?: User
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/signin')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          {user ? (
            <UserAvatar className="h-8 w-8">
              <AvatarImage
                src={user?.avatar || '/placeholder.svg'}
                alt={`${user?.firstName} ${user?.lastName}`}
              />
              <AvatarFallback>{`${user?.firstName} ${user?.lastName}`}</AvatarFallback>
            </UserAvatar>
          ) : (
            <Avatar size={38} type="user" customDefault="thumbnail" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
            <p className="text-muted-foreground text-xs leading-none">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
