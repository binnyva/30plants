import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('GET /api/lists/[id] route hit:', { params })
  try {
    const listId = parseInt(params.id)
    
    if (!listId) {
      console.log('Invalid list ID:', params.id)
      return NextResponse.json(
        { error: 'List ID is required' },
        { status: 400 }
      )
    }

    const list = await prisma.list.findUnique({
      where: { id: listId },
      include: {
        items: {
          orderBy: {
            position: 'asc'
          }
        }
      }
    })

    if (!list) {
      console.log('List not found:', listId)
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      )
    }

    console.log('List found:', list.id)
    return NextResponse.json(list)
  } catch (error) {
    console.error('Error fetching list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch list' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title } = await request.json()
    const listId = parseInt(params.id)

    if (!title || !listId) {
      return NextResponse.json(
        { error: 'Title and list ID are required' },
        { status: 400 }
      )
    }

    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: { title },
      include: {
        items: {
          orderBy: {
            position: 'asc'
          }
        }
      }
    })

    return NextResponse.json(updatedList)
  } catch (error) {
    console.error('Error updating list:', error)
    return NextResponse.json(
      { error: 'Failed to update list' },
      { status: 500 }
    )
  }
} 