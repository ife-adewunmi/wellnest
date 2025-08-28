'use client'

import { useState } from 'react'
import { mlApi } from '@/shared/service/ml-model/ml-api'
import type { PredictResponse } from '@/src/shared/service/ml-model/ml.service'

export default function MLDemoPage() {
  const [mode, setMode] = useState<'form' | 'json'>('form')
  const [formData, setFormData] = useState({
    Gender: 'Female',
    'Social Platform Preference': 'Instagram',
    'Sleep Duration (hours/night)': 4.0,
    'Screen Time Before Sleep (hours)': 6.0,
    'Dominant Daily Emotion': 'Sad',
    'Uses Focus Apps': false,
    'Counselling Attendance': 'No',
    SME: 8.0,
    sleep_to_screen_ratio: 5.0,
    'Social Media Usage (hours/day)': 12.0,
    'Number of Notifications (per day)': 8.0,
  })
  const [jsonInput, setJsonInput] = useState(JSON.stringify(formData, null, 2))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictResponse | null>(null)

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let features: any
      if (mode === 'form') {
        features = formData
      } else {
        try {
          features = JSON.parse(jsonInput)
        } catch {
          throw new Error('Invalid JSON input')
        }
      }

      const data = await mlApi.predictedData({ features })
      setResult(data)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">ML Demo</h1>

      {/* Mode Toggle */}
      <div className="mb-6 flex gap-4">
        <button
          type="button"
          className={`rounded-xl px-4 py-2 shadow ${
            mode === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setMode('form')}
        >
          📝 Form Mode
        </button>
        <button
          type="button"
          className={`rounded-xl px-4 py-2 shadow ${
            mode === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setMode('json')}
        >
          💻 JSON Mode
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {mode === 'form' ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="flex flex-col rounded-2xl bg-white p-4 shadow-md">
                <label className="mb-2 text-sm font-medium text-gray-700">{key}</label>

                {typeof value === 'boolean' ? (
                  <select
                    className="rounded-lg border border-gray-300 p-2"
                    value={value ? 'true' : 'false'}
                    onChange={(e) => handleFormChange(key, e.target.value === 'true')}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : typeof value === 'number' ? (
                  <input
                    type="number"
                    className="rounded-lg border border-gray-300 p-2"
                    value={value}
                    onChange={(e) => handleFormChange(key, Number(e.target.value))}
                  />
                ) : (
                  <input
                    type="text"
                    className="rounded-lg border border-gray-300 p-2"
                    value={value as string}
                    onChange={(e) => handleFormChange(key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <textarea
            className="h-72 w-full rounded-xl border border-gray-300 p-4 font-mono text-sm shadow"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
        )}

        <button
          type="submit"
          className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white shadow-md transition hover:bg-green-700"
          disabled={loading}
        >
          {loading ? '🔮 Predicting...' : '🚀 Predict'}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-100 p-3 text-red-600">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 rounded-2xl border bg-gray-50 p-4 shadow">
          <h2 className="text-lg font-semibold">📊 Prediction Result:</h2>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-3 text-sm shadow-inner">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-gray-500">
        Note: Configure <code>ML_API_BASE_URL</code> in your environment.
      </p>
    </div>
  )
}
