'use client'

import { useState, useEffect } from 'react'
import { storage, List as ListType } from './lib/storage'
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
  const [latestList, setLatestList] = useState<ListType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')

  const fetchLatestList = () => {
    try {
      const lists = storage.getLists()
      // Get the most recent list
      const sortedLists = [...lists].sort((a, b) => 
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

  const createNewList = () => {
    try {
      const newList = storage.createList()
      setLatestList(newList)
      setEditedTitle(newList.title)
      setIsEditingTitle(true) // Automatically enter edit mode for new lists
    } catch (err) {
      setError('Failed to create new list')
      console.error('Error creating list:', err)
    }
  }

  const updateListTitle = () => {
    if (!latestList || !editedTitle.trim()) return

    try {
      const updatedList = storage.updateList(latestList.id, { title: editedTitle.trim() })
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

  const addItemToList = async (listId: string, content: string) => {
    try {
      const newItem = storage.addListItem(listId, content)
      
      if (latestList && latestList.id === listId) {
        setLatestList({
          ...latestList,
          items: [...latestList.items, newItem]
        })
      }
      setError(null)
      return newItem
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to list')
      console.error('Error adding item:', err)
      throw err
    }
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Plant List</h1>
          <button
            onClick={createNewList}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            New List
          </button>
        </div>
      </div>

      {latestList ? (
        <div className="bg-gray-800 rounded-lg p-6">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="mb-6">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full bg-gray-700 text-white px-6 py-3 rounded-lg text-xl font-semibold border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter list title"
                autoFocus
              />
            </form>
          ) : (
            <div className="mb-6 pb-4 border-b border-gray-700">
              <h2
                className="text-2xl font-bold text-white hover:text-gray-300 transition-colors cursor-pointer flex items-center gap-2"
                onClick={() => {
                  setIsEditingTitle(true)
                  setEditedTitle(latestList.title)
                }}
              >
                {latestList.title}
                <span className="text-gray-500 text-sm hover:text-gray-400">✏️</span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Created {new Date(latestList.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          <List
            id={latestList.id}
            title={latestList.title}
            items={latestList.items}
            onAddItem={(content) => addItemToList(latestList.id, content)}
          />
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          No lists yet. Create a new one to get started!
        </div>
      )}
    </main>
  )
}
