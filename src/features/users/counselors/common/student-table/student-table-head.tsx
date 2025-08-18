export function StudentTableHead() {
  return (
    <thead className="border-b border-gray-200 bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
          Student
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
          Last Check-in
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
          Risk Level
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
          Current Mood
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
          Screen Time
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
          Actions
        </th>
      </tr>
    </thead>
  )
}
