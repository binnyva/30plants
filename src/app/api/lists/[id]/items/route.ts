import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 })
  }

  try {
    const listId = parseInt(params.id)
    
    // Verify the list exists and get its items
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
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    return NextResponse.json(list.items)
  } catch (error) {
    console.error('Error fetching list items:', error)
    return NextResponse.json(
      { error: 'Error fetching items' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const listId = parseInt(params.id)
    
    // Verify the list exists
    const list = await prisma.list.findUnique({
      where: { id: listId }
    })
    
    if (!list) {
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    // Get the highest position number for the current list
    const lastItem = await prisma.listItem.findFirst({
      where: { listId },
      orderBy: { position: 'desc' },
    })
    const position = lastItem ? lastItem.position + 1 : 1

    const item = await prisma.listItem.create({
      data: {
        content,
        position,
        listId,
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating list item:', error)
    return NextResponse.json(
      { error: 'Error creating item' },
      { status: 500 }
    )
  }
} 