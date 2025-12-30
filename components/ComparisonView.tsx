'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { GitCompare, X, Plus } from 'lucide-react'
import type { ScheduleEvent, GapAnalysis } from '@/types'

interface ComparisonViewProps {
  schedules: Array<{
    name: string
    events: ScheduleEvent[]
    analysis: GapAnalysis
  }>
  onAddSchedule: () => void
  onRemoveSchedule: (index: number) => void
}

export default function ComparisonView({ schedules, onAddSchedule, onRemoveSchedule }: ComparisonViewProps) {
  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
        <GitCompare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">No schedules to compare</p>
        <button
          onClick={onAddSchedule}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg"
        >
          Add Schedule to Compare
        </button>
      </div>
    )
  }

  const chartData = Array.from({ length: 24 }, (_, hour) => {
    const data: any = { hour: `${hour}:00` }
    schedules.forEach((schedule, index) => {
      const slot = schedule.analysis.timeSlots[hour]
      data[`${schedule.name}_required`] = (slot.requiredCoverage * 100).toFixed(0)
      data[`${schedule.name}_actual`] = (slot.actualCoverage * 100).toFixed(0)
      data[`${schedule.name}_gap`] = (slot.gap * 100).toFixed(0)
    })
    return data
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Schedule Comparison</h3>
          <button
            onClick={onAddSchedule}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Schedule
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200 flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-gray-800">{schedule.name}</h4>
                <p className="text-sm text-gray-600">
                  {schedule.events.length} events | {schedule.analysis.criticalGaps.length} critical gaps
                </p>
              </div>
              <button
                onClick={() => onRemoveSchedule(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" angle={-45} textAnchor="end" height={80} />
            <YAxis label={{ value: 'Coverage %', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            {schedules.map((schedule, index) => (
              <Bar
                key={`${schedule.name}_gap`}
                dataKey={`${schedule.name}_gap`}
                fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : '#10b981'}
                name={`${schedule.name} Gap`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

