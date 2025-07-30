import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'

interface ReportOptionsProps {
  options: {
    moodHistory: boolean
    screenTime: boolean
    socialMediaUsage: boolean
  }
  onOptionChange?: (key: string, checked: boolean) => void
}

export function ReportOptions({ options, onOptionChange }: ReportOptionsProps) {
  const handleCheckboxChange = (key: string) => (checked: boolean) => {
    onOptionChange?.(key, checked)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="mood-history"
            checked={options.moodHistory}
            onCheckedChange={handleCheckboxChange('moodHistory')}
          />
          <Label
            htmlFor="mood-history"
            className="cursor-pointer text-sm font-medium text-gray-700"
          >
            Mood History
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="screen-time"
            checked={options.screenTime}
            onCheckedChange={handleCheckboxChange('screenTime')}
          />
          <Label htmlFor="screen-time" className="cursor-pointer text-sm font-medium text-gray-700">
            Screen Time
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="social-media"
            checked={options.socialMediaUsage}
            onCheckedChange={handleCheckboxChange('socialMediaUsage')}
          />
          <Label
            htmlFor="social-media"
            className="cursor-pointer text-sm font-medium text-gray-700"
          >
            Social Media Usage
          </Label>
        </div>
      </div>
    </div>
  )
}
