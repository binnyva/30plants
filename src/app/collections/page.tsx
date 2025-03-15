'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CollectionItem {
  id: number
  content: string
  position: number
}

interface Collection {
  id: number
  title: string
  items: CollectionItem[]
  createdAt: string
}

export default function Collections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [newCollectionTitle, setNewCollectionTitle] = useState('')
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [newItemContent, setNewItemContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections')
      if (!response.ok) {
        throw new Error('Failed to fetch collections')
      }
      const data = await response.json()
      setCollections(data)
    } catch (err) {
      setError('Failed to load collections')
      console.error('Error fetching collections:', err)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const createCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newCollectionTitle }),
      })

      if (!response.ok) {
        throw new Error('Failed to create collection')
      }

      const newCollection = await response.json()
      setCollections([...collections, newCollection])
      setNewCollectionTitle('')
      setError(null)
    } catch (err) {
      setError('Failed to create collection')
      console.error('Error creating collection:', err)
    }
  }

  const addItemToCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCollection) return

    try {
      const response = await fetch('/api/collection-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newItemContent,
          collectionId: selectedCollection.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add item')
      }

      const newItem = await response.json()
      setSelectedCollection({
        ...selectedCollection,
        items: [...selectedCollection.items, newItem],
      })
      setNewItemContent('')
      await fetchCollections() // Refresh the collections list
      setError(null)
    } catch (err) {
      setError('Failed to add item to collection')
      console.error('Error adding item:', err)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Collections</h1>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Create new collection form */}
      <form onSubmit={createCollection} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCollectionTitle}
            onChange={(e) => setNewCollectionTitle(e.target.value)}
            placeholder="Enter collection name"
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Collection
          </button>
        </div>
      </form>

      {/* Collections list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map(collection => (
          <div
            key={collection.id}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">{collection.title}</h2>
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                {collection.items.length} items
              </span>
            </div>

            {/* Collection items */}
            <ul className="space-y-2 mb-4">
              {collection.items.map(item => (
                <li
                  key={item.id}
                  className="bg-gray-700 text-white p-3 rounded-lg"
                >
                  {item.content}
                </li>
              ))}
            </ul>

            {/* Add item form */}
            {selectedCollection?.id === collection.id ? (
              <form onSubmit={addItemToCollection} className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemContent}
                    onChange={(e) => setNewItemContent(e.target.value)}
                    placeholder="Add new item"
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setSelectedCollection(collection)}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Add Items
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  )
} 