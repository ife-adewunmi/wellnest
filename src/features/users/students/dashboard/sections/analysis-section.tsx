import { MoodHistoryChart } from '@/src/features/users/students/components/mood-history-chart'

export function StudentAnalysisSection({ userId }: { userId: string }) {
  return (
    <div className="mt-6">
      <MoodHistoryChart userId={userId} />
      {/* Add other analysis widgets here later */}
    </div>
  )
}
