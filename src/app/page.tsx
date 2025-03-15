'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import List from './components/List'

interface ListItem {
  id: number
  content: string
  position: number
}

interface ListData {
  id: number
  title: string
  items: ListItem[]
}

export default function Home() {
  const [latestList, setLatestList] = useState<ListData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')

  const fetchLatestList = async () => {
    try {
      const response = await fetch('/api/lists')
      if (!response.ok) {
        throw new Error('Failed to fetch lists')
      }
      const data = await response.json()
      // Get the most recent list
      const sortedLists = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setLatestList(sortedLists[0] || null)
    } catch (err) {
      setError('Failed to load lists')
      console.error('Error fetching lists:', err)
    }
  }

  useEffect(() => {
    fetchLatestList()
  }, [])

  const createNewList = async () => {
    try {
      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New List' }), // Default title
      })
      if (!response.ok) {
        throw new Error('Failed to create list')
      }
      const newList = await response.json()
      setLatestList(newList)
      setEditedTitle(newList.title)
      setIsEditingTitle(true) // Automatically enter edit mode for new lists
    } catch (err) {
      setError('Failed to create new list')
      console.error('Error creating list:', err)
    }
  }

  const updateListTitle = async () => {
    if (!latestList || !editedTitle.trim()) return

    try {
      const response = await fetch(`/api/lists/${latestList.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editedTitle.trim() }),
      })

      if (!response.ok) {
        throw new Error('Failed to update list title')
      }

      const updatedList = await response.json()
      setLatestList(updatedList)
      setIsEditingTitle(false)
      setError(null)
    } catch (err) {
      setError('Failed to update list title')
      console.error('Error updating list title:', err)
    }
  }

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateListTitle()
  }

  const addItemToList = async (listId: number, content: string) => {
    try {
      console.log('Adding item to list:', { listId, content })
      
      const response = await fetch(`/api/lists/${listId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item')
      }
      
      if (latestList && latestList.id === listId) {
        setLatestList({
          ...latestList,
          items: [...latestList.items, data]
        })
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to list')
      console.error('Error adding item:', err)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1 mr-4">
          <h1 className="text-3xl font-bold text-white">Latest List</h1>
        </div>
        <button
          onClick={createNewList}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Create New List
        </button>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {latestList ? (
          <div>
            {isEditingTitle ? (
              <form onSubmit={handleTitleSubmit} className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter list title"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingTitle(false)
                    setEditedTitle(latestList.title)
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-bold text-white">{latestList.title}</h2>
                <button
                  onClick={() => {
                    setIsEditingTitle(true)
                    setEditedTitle(latestList.title)
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✏️
                </button>
              </div>
            )}
            <List
              key={latestList.id}
              id={latestList.id}
              title={latestList.title}
              items={latestList.items}
              onAddItem={(content) => addItemToList(latestList.id, content)}
            />
          </div>
        ) : (
          <div className="text-white text-center py-8">
            No lists created yet. Create your first list!
          </div>
        )}
      </div>

    </main>
  )
}
