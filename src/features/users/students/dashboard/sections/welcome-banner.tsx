import { Card, CardContent } from '@/shared/components/ui/card'

export function WelcomeBanner({ greeting }: { greeting: string }) {
  return (
    <Card className="border-0 bg-[#7B2020] text-white">
      <CardContent className="p-5">
        <div className="text-[18px] font-bold">{greeting}</div>
        <div className="mt-2 text-[12px] opacity-80">
          Welcome back to your portal account! You can start by using the menu dashboard to navigate
          the portal
        </div>
      </CardContent>
    </Card>
  )
}

