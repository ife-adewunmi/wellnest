import { MetricCard } from '../metric-card'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'

export interface Metric {
  title: string
  value: string
  change: string
  positive: boolean
}

interface MetricsSectionProps {
  metrics: Metric[]
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  const { isWidgetEnabled } = useDashboardSettings()

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:mt-[2.8125rem] lg:grid-cols-3 lg:gap-6 xl:grid-cols-5">
      {metrics.map((metric, index) => {
        // Hide distress score if the widget is disabled
        if (metric.title === 'Distress Alerts' && !isWidgetEnabled('distress-score')) {
          return null
        }
        return (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            positive={metric.positive}
          />
        )
      })}
    </div>
  )
}
