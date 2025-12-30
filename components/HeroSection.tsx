'use client'

import { Sparkles, TrendingUp, Clock, Shield, Zap, BarChart3 } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 opacity-10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-40 h-40 bg-white rounded-3xl shadow-2xl p-4 transform hover:scale-110 hover:rotate-3 transition-all duration-300 border-4 border-purple-200">
            {/* Placeholder for Fountain Vitality logo - replace with actual logo */}
            {/* To add your logo: 
                1. Place your logo file in the /public folder as "fountain-vitality-logo.png"
                2. Uncomment the Image import above
                3. Replace the div below with:
                <Image 
                  src="/fountain-vitality-logo.png" 
                  alt="Fountain Vitality" 
                  width={144} 
                  height={144} 
                  className="object-contain w-full h-full" 
                />
            */}
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex flex-col items-center justify-center">
              <span className="text-white font-extrabold text-4xl mb-1">FV</span>
              <span className="text-white text-xs font-semibold">Fountain Vitality</span>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6 shadow-lg">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">Powered by Fountain Vitality</span>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Smart Schedule
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analysis
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-700 font-medium max-w-3xl mx-auto mb-8">
            Transform your team's schedule into <span className="text-purple-600 font-bold">actionable insights</span>
          </p>
        </div>

        {/* Value Propositions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-purple-200">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Optimize Coverage</h3>
            <p className="text-gray-600">
              Identify gaps in your schedule and ensure you have the right staffing levels at peak times
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Save Time & Money</h3>
            <p className="text-gray-600">
              Automatically analyze schedules from any format - images, PDFs, Word docs, or calendar files
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-pink-200">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Data-Driven Decisions</h3>
            <p className="text-gray-600">
              Get visual insights and recommendations to improve your team's scheduling efficiency
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50 rounded-3xl p-8 shadow-2xl border-2 border-purple-200">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Why Choose Our Schedule Analyzer?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Time-Based Analysis</h4>
                <p className="text-gray-600 text-sm">Understands that 2pm needs more coverage than 10pm - automatically adjusts expectations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Universal Format Support</h4>
                <p className="text-gray-600 text-sm">Works with calendars, images, PDFs, Word docs - no manual data entry needed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Instant Insights</h4>
                <p className="text-gray-600 text-sm">Get comprehensive gap analysis and recommendations in seconds</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Smart Recommendations</h4>
                <p className="text-gray-600 text-sm">Actionable suggestions to improve coverage during critical hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

