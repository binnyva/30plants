'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ListData {
  id: number
  title: string
  createdAt: string
  items: any[]
}

export default function AllLists() {
  const [lists, setLists] = useState<ListData[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/lists')
      if (!response.ok) {
        throw new Error('Failed to fetch lists')
      }
      const data = await response.json()
      // Sort lists by title in reverse order
      const sortedLists = [...data].sort((a, b) => b.title.localeCompare(a.title))
      setLists(sortedLists)
    } catch (err) {
      setError('Failed to load lists')
      console.error('Error fetching lists:', err)
    }
  }

  useEffect(() => {
    fetchLists()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">All Lists</h1>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {lists.length > 0 ? (
          lists.map(list => (
            <Link
              key={list.id}
              href={`/lists/${list.id}`}
              className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">{list.title}</h2>
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {list.items.length} items
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Created: {new Date(list.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))
        ) : (
          <div className="text-white text-center py-8">
            No lists found
          </div>
        )}
      </div>
    </main>
  )
} 