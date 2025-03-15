'use client'

import { useState, useEffect } from 'react'
import { storage, Collection, ListItem } from '../lib/storage'

interface ListProps {
  id: string
  title: string
  items: ListItem[]
  onAddItem: (content: string) => Promise<ListItem>
}

export default function List({ id, title, items = [], onAddItem }: ListProps) {
  const [newItem, setNewItem] = useState('')
  const [collections, setCollections] = useState<Collection[]>([])
  const [showCollections, setShowCollections] = useState(false)
  const [isAddingItems, setIsAddingItems] = useState(false)

  useEffect(() => {
    // Load collections from local storage
    const data = storage.getCollections()
    setCollections(data)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.trim()) {
      try {
        setIsAddingItems(true)
        // Check if the input matches a collection name
        const matchingCollection = collections.find(
          c => c.title.toLowerCase() === newItem.trim().toLowerCase()
        )
        
        if (matchingCollection) {
          // Add each item from the collection sequentially
          for (const item of matchingCollection.items) {
            await onAddItem(item.content)
          }
        } else {
          // Add as normal item
          await onAddItem(newItem.trim())
        }
        setNewItem('')
        setShowCollections(false)
      } finally {
        setIsAddingItems(false)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewItem(value)
    // Show collections dropdown if input matches any collection names
    setShowCollections(
      value.length > 0 && collections.some(c => 
        c.title.toLowerCase().includes(value.toLowerCase())
      )
    )
  }

  const selectCollection = (collection: Collection) => {
    setNewItem(collection.title)
    setShowCollections(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={newItem}
            onChange={handleInputChange}
            disabled={isAddingItems}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            placeholder={isAddingItems ? "Adding items..." : "Add a new item..."}
          />
          {isAddingItems && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-white"></div>
            </div>
          )}
        </div>
        
        {showCollections && collections.length > 0 && !isAddingItems && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700 rounded-lg shadow-lg overflow-hidden z-10">
            {collections
              .filter(c => c.title.toLowerCase().includes(newItem.toLowerCase()))
              .map(collection => (
                <button
                  key={collection.id}
                  type="button"
                  onClick={() => selectCollection(collection)}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-600"
                >
                  {collection.title} ({collection.items.length} items)
                </button>
              ))}
          </div>
        )}
      </form>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="bg-gray-700 px-4 py-2 rounded-lg text-white flex items-center"
          >
            <span className="w-8 text-gray-400 font-medium">{index + 1}.</span>
            <span className="flex-1">{item.content}</span>
            {item.completed && (
              <span className="text-green-500 ml-2">✓</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
} 