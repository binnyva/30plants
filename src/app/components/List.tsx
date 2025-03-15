import { useState, useEffect } from 'react'

interface ListItem {
  id: number
  content: string
  position: number
  isCollection?: boolean
}

interface Collection {
  id: number
  title: string
  items: { content: string }[]
}

interface ListProps {
  id: number
  title: string
  items: ListItem[]
  onAddItem: (content: string, isCollection?: boolean) => void
}

export default function List({ id, title, items = [], onAddItem }: ListProps) {
  const [newItem, setNewItem] = useState('')
  const [collections, setCollections] = useState<Collection[]>([])
  const [showCollections, setShowCollections] = useState(false)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections')
        if (!response.ok) throw new Error('Failed to fetch collections')
        const data = await response.json()
        setCollections(data)
      } catch (error) {
        console.error('Error fetching collections:', error)
      }
    }
    fetchCollections()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.trim()) {
      // Check if the input matches a collection name
      const matchingCollection = collections.find(
        c => c.title.toLowerCase() === newItem.trim().toLowerCase()
      )
      
      if (matchingCollection) {
        // If it's a collection, add each item from the collection
        // Using Promise.all to add all items concurrently and wait for all to complete
        const addPromises = matchingCollection.items.map(item => 
          onAddItem(item.content)
        )
        await Promise.all(addPromises)
      } else {
        // If it's not a collection, add as normal item
        await onAddItem(newItem.trim())
      }
      setNewItem('')
      setShowCollections(false)
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
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      
      <form onSubmit={handleSubmit} className="mb-4 relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newItem}
              onChange={handleInputChange}
              placeholder="Add new item or type collection name"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400 border-gray-600"
            />
            
            {/* Collections dropdown */}
            {showCollections && collections.length > 0 && (
              <div className="absolute w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {collections
                  .filter(c => c.title.toLowerCase().includes(newItem.toLowerCase()))
                  .map(collection => (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => selectCollection(collection)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 text-white"
                    >
                      <div className="font-medium">{collection.title}</div>
                      <div className="text-sm text-gray-400">
                        {collection.items.length} items
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg text-white"
          >
            <span className="font-medium text-gray-400">{index + 1}.</span>
            <span>{item.content}</span>
          </li>
        ))}
      </ul>
    </div>
  )
} 