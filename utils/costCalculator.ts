import type { GapAnalysis, CostAnalysis } from '@/types'

export function calculateCostAnalysis(
  analysis: GapAnalysis,
  hourlyRate: number = 25
): CostAnalysis {
  const gapCostByHour: Record<number, number> = {}
  let totalGapCost = 0

  // Calculate cost for each hour with a gap
  analysis.timeSlots.forEach(slot => {
    if (slot.gap > 0) {
      // Gap represents missing coverage (as a percentage)
      // Convert to hours and multiply by rate
      const gapHours = slot.gap
      const hourCost = gapHours * hourlyRate
      gapCostByHour[slot.hour] = hourCost
      totalGapCost += hourCost
    }
  })

  // Estimate overtime cost (if gaps are filled with overtime at 1.5x rate)
  const overtimeCost = totalGapCost * 1.5

  // Potential savings if gaps are filled with regular staff
  const potentialSavings = totalGapCost

  return {
    hourlyRate,
    totalGapCost,
    overtimeCost,
    potentialSavings,
    gapCostByHour,
  }
}

