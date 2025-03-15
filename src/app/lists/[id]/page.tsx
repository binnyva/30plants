'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import List from '@/app/components/List'
import { storage, List as ListType } from '@/app/lib/storage'

export default function ListDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [list, setList] = useState<ListType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const fetchList = () => {
    try {
      const currentList = storage.getList(params.id)
      if (!currentList) {
        throw new Error('List not found')
      }
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

  const addItemToList = async (listId: string, content: string) => {
    try {
      const newItem = storage.addListItem(listId, content)
      
      if (list) {
        setList(prevList => {
          if (!prevList) return null
          return {
            ...prevList,
            items: [...prevList.items, newItem]
          }
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

  const updateListTitle = () => {
    if (!list || !editedTitle.trim()) return

    try {
      const updatedList = storage.updateList(list.id, { title: editedTitle.trim() })
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

  const handleDelete = () => {
    if (!list) return
    try {
      storage.deleteList(list.id)
      router.push('/all-lists')
    } catch (err) {
      setError('Failed to delete list')
      console.error('Error deleting list:', err)
    }
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
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/all-lists"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to All Lists
          </Link>
        </div>
      </div>

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
                setEditedTitle(list.title)
              }}
            >
              {list.title}
              <span className="text-gray-500 text-sm hover:text-gray-400">✏️</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Created {new Date(list.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        <List
          id={list.id}
          title={list.title}
          items={list.items}
          onAddItem={(content) => addItemToList(list.id, content)}
        />

        <div className="mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors"
          >
            Delete List
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Delete List</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete &ldquo;{list.title}&rdquo;? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 