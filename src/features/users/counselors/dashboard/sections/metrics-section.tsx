import { MetricsGrid, MetricCardList } from '../metrics'
import type { Metric } from '../metrics'

interface MetricsSectionProps {
  metrics: Metric[]
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  return (
    <MetricsGrid>
      <MetricCardList metrics={metrics} />
    </MetricsGrid>
  )
}
