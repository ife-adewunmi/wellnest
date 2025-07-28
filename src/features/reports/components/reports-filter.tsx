
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { Input } from "@/shared/components/ui/custom-input"
import { interRegular } from "@/shared/styles/fonts"


interface ReportFiltersProps {
  filters: {
    department: string
    student: string
    level: string
    gender: string
    startDate: string
    endDate: string
    exportType: string
  }
  onFilterChange?: (key: string, value: string) => void
}




export function ReportFilters({ filters, onFilterChange }: ReportFiltersProps) {
  const handleSelectChange = (key: string) => (value: string) => {
    onFilterChange?.(key, value)
  }

  const handleInputChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange?.(key, e.target.value)
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col">
          <Label htmlFor="department" className={`${interRegular.className} text-[1rem] text-[#666666] mb-[12px]`}>
            Department
          </Label>
          <Select value={filters.department} onValueChange={handleSelectChange("department")}>
            <SelectTrigger id="department">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="computer-science">Computer Science</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="medicine">Medicine</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[12px]">
          <Label htmlFor="student" className={`${interRegular.className} text-[1rem] text-[#666666]`}>
            Student
          </Label>
          <Select value={filters.student} onValueChange={handleSelectChange("student")}>
            <SelectTrigger id="student">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oyemakinde-tinubu">Oyemakinde Tinubu</SelectItem>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[12px]">
          <Label htmlFor="level" className={`${interRegular.className} text-[1rem] text-[#666666]`}>
            Level
          </Label>
          <Select value={filters.level} onValueChange={handleSelectChange("level")}>
            <SelectTrigger id="level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="200">200</SelectItem>
              <SelectItem value="300">300</SelectItem>
              <SelectItem value="400">400</SelectItem>
              <SelectItem value="500">500</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4 mt-[3.5rem]">
        <div className="flex flex-col gap-[12px]">
          <Label htmlFor="gender" className={`${interRegular.className} text-[1rem] text-[#666666]`}>
            Gender
          </Label>
          <Select value={filters.gender} onValueChange={handleSelectChange("gender")}>
            <SelectTrigger id="gender">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[12px]">
          <Label htmlFor="start-date" className={`${interRegular.className} text-[1rem] text-[#666666]`}>
            Start Date
          </Label>
          <Input
            id="start-date"
            type="date"
            value={filters.startDate}
            onChange={handleInputChange("startDate")}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-[12px]">
          <Label htmlFor="end-date" className={`${interRegular.className} text-[1rem] text-[#666666]`}>
            End Date
          </Label>
          <Input
            id="end-date"
            type="date"
            value={filters.endDate}
            onChange={handleInputChange("endDate")}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-[12px]">
          <Label htmlFor="export-type" className={`${interRegular.className} text-[1rem] text-[#666666]`}>
            Export Type
          </Label>
          <Select value={filters.exportType} onValueChange={handleSelectChange("exportType")}>
            <SelectTrigger id="export-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">.xlsx</SelectItem>
              <SelectItem value="csv">.csv</SelectItem>
              <SelectItem value="pdf">.pdf</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
