import { MetricCard } from './metric-card'
import { useDashboardSettings } from '@/shared/contexts/dashboard-settings-context'

export interface Metric {
  title: string
  value: string
  change: string
  positive: boolean
}

interface MetricCardListProps {
  metrics: Metric[]
}

export function MetricCardList({ metrics }: MetricCardListProps) {
  const { isWidgetEnabled } = useDashboardSettings()

  return (
    <>
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
    </>
  )
}
