// components/settings/WidgetToggleItem.tsx
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Label } from "@/shared/components/ui/label"

interface WidgetToggleItemProps {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}

export const WidgetToggleItem = ({
  id,
  label,
  checked,
  onChange
}: WidgetToggleItemProps) => (
  <div className="flex items-center space-x-3">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onChange}
      className="h-5 w-5 rounded-md border-2 data-[state=checked]:bg-primary"
    />
    <Label htmlFor={id} className="text-sm font-medium">
      {label}
    </Label>
  </div>
)