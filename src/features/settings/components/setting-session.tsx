// components/settings/SettingsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

interface SettingsSectionProps {
  title: string
  children: React.ReactNode
  gridLayout?: boolean
}

export const SettingsSection = ({ title, children, gridLayout = false }: SettingsSectionProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent className={gridLayout ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : 'space-y-4'}>
      {children}
    </CardContent>
  </Card>
)
