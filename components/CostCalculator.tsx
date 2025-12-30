'use client'

import { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { calculateCostAnalysis } from '@/utils/costCalculator'
import type { GapAnalysis, CostAnalysis } from '@/types'

interface CostCalculatorProps {
  analysis: GapAnalysis
  onCostCalculated?: (cost: CostAnalysis) => void
}

export default function CostCalculator({ analysis, onCostCalculated }: CostCalculatorProps) {
  const [hourlyRate, setHourlyRate] = useState(25)
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null)

  useEffect(() => {
    const cost = calculateCostAnalysis(analysis, hourlyRate)
    setCostAnalysis(cost)
    onCostCalculated?.(cost)
  }, [analysis, hourlyRate, onCostCalculated])

  if (!costAnalysis) return null

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border-2 border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Cost Analysis</h3>
          <p className="text-sm text-gray-600">Financial impact of schedule gaps</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hourly Rate ($)
        </label>
        <input
          type="number"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
          className="w-full px-4 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="0"
          step="0.5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Total Gap Cost</span>
          </div>
          <p className="text-3xl font-bold text-red-600">
            ${costAnalysis.totalGapCost.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Cost of understaffing</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Overtime Cost</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            ${costAnalysis.overtimeCost.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">If filled with OT (1.5x)</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Potential Savings</span>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${costAnalysis.potentialSavings.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">If gaps are filled</p>
        </div>
      </div>

      {Object.keys(costAnalysis.gapCostByHour).length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2">Cost by Hour</h4>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {Object.entries(costAnalysis.gapCostByHour)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .slice(0, 12)
              .map(([hour, cost]) => (
                <div key={hour} className="text-center">
                  <div className="font-medium text-gray-600">{hour}:00</div>
                  <div className="text-green-600 font-semibold">${cost.toFixed(2)}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

