export interface ScheduleEvent {
  title: string
  start: Date
  end: Date
  description?: string
}

export interface TimeSlot {
  hour: number
  requiredCoverage: number
  actualCoverage: number
  gap: number
}

export interface GapAnalysis {
  timeSlots: TimeSlot[]
  totalGaps: number
  criticalGaps: TimeSlot[]
  recommendations: string[]
}

export interface CoverageProfile {
  id: string
  name: string
  coverage: Record<number, number>
  isCustom: boolean
}

export interface SavedAnalysis {
  id: string
  timestamp: Date
  events: ScheduleEvent[]
  analysis: GapAnalysis
  coverageProfile?: CoverageProfile
  costAnalysis?: CostAnalysis
}

export interface CostAnalysis {
  hourlyRate: number
  totalGapCost: number
  overtimeCost: number
  potentialSavings: number
  gapCostByHour: Record<number, number>
}

export interface ComparisonData {
  schedules: Array<{
    name: string
    analysis: GapAnalysis
    events: ScheduleEvent[]
  }>
}

