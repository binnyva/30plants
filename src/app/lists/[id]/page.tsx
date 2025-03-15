'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import List from '@/app/components/List'

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

export default function ListDetails({ params }: { params: { id: string } }) {
  const [list, setList] = useState<ListData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')

  const fetchList = async () => {
    try {
      const response = await fetch(`/api/lists/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch list')
      }
      const currentList = await response.json()
      setList(currentList)
      setEditedTitle(currentList.title)
    } catch (err) {
      setError('Failed to load list')
      console.error('Error fetching list:', err)
    }
  }

  useEffect(() => {
    fetchList()
  }, [params.id])

  const addItemToList = async (listId: number, content: string) => {
    try {
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
      
      if (list) {
        setList(prevList => {
          if (!prevList) return null
          return {
            ...prevList,
            items: [...prevList.items, data]
          }
        })
      }
      setError(null)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to list')
      console.error('Error adding item:', err)
      throw err
    }
  }

  const updateListTitle = async () => {
    if (!list || !editedTitle.trim()) return

    try {
      const response = await fetch(`/api/lists/${list.id}`, {
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
      setList(updatedList)
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

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
        <Link
          href="/all-lists"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Back to All Lists
        </Link>
      </main>
    )
  }

  if (!list) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-white text-center">Loading...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1 mr-4">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center gap-2">
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
                  setEditedTitle(list?.title || '')
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white">{list?.title}</h1>
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✏️
              </button>
            </div>
          )}
        </div>
        <Link 
          href="/all-lists"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to All Lists
        </Link>
      </div>

      <List
        id={list.id}
        title={list.title}
        items={list.items}
        onAddItem={(content) => addItemToList(list.id, content)}
      />
    </main>
  )
} 