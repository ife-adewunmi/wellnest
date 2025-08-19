import { MoodHistoryChart } from '@/features/mood/components/mood-history-chart'

export function StudentAnalysisSection({ userId }: { userId: string }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <MoodHistoryChart userId={userId} />
      {/* Add other analysis widgets here later */}
    </div>
  )
}

