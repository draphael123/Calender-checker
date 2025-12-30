'use client'

import { useState, useEffect } from 'react'
import { Filter, X } from 'lucide-react'
import type { ScheduleEvent } from '@/types'

interface FilterPanelProps {
  events: ScheduleEvent[]
  onFiltered: (filtered: ScheduleEvent[]) => void
}

export default function FilterPanel({ events, onFiltered }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [timeRange, setTimeRange] = useState({ start: 0, end: 23 })

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const applyFilters = () => {
    let filtered = [...events]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Day filter
    if (selectedDays.length > 0) {
      filtered = filtered.filter(event => {
        const day = event.start.getDay()
        return selectedDays.includes(day)
      })
    }

    // Time range filter
    filtered = filtered.filter(event => {
      const startHour = event.start.getHours()
      const endHour = event.end.getHours()
      return (startHour >= timeRange.start && startHour <= timeRange.end) ||
             (endHour >= timeRange.start && endHour <= timeRange.end) ||
             (startHour <= timeRange.start && endHour >= timeRange.end)
    })

    onFiltered(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedDays([])
    setTimeRange({ start: 0, end: 23 })
    onFiltered(events)
  }

  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedDays, timeRange, events])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center gap-2 transition-colors"
      >
        <Filter className="w-5 h-5" />
        <span>Filter & Search</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Filter & Search</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Events
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    applyFilters()
                  }}
                  placeholder="Search by title or description..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days of Week
                </label>
                <div className="flex flex-wrap gap-2">
                  {days.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        toggleDay(index)
                        applyFilters()
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedDays.includes(index)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Range: {timeRange.start}:00 - {timeRange.end}:00
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">Start Hour</label>
                    <input
                      type="range"
                      min="0"
                      max="23"
                      value={timeRange.start}
                      onChange={(e) => {
                        setTimeRange({ ...timeRange, start: parseInt(e.target.value) })
                        applyFilters()
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-600">End Hour</label>
                    <input
                      type="range"
                      min="0"
                      max="23"
                      value={timeRange.end}
                      onChange={(e) => {
                        setTimeRange({ ...timeRange, end: parseInt(e.target.value) })
                        applyFilters()
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    applyFilters()
                    setIsOpen(false)
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

