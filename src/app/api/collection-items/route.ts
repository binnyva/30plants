import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: Request) {
  try {
    const { content, collectionId } = await request.json()

    // Get the highest position number for this collection
    const lastItem = await prisma.collectionItem.findFirst({
      where: { collectionId },
      orderBy: { position: 'desc' }
    })
    const position = lastItem ? lastItem.position + 1 : 0

    const item = await prisma.collectionItem.create({
      data: {
        content,
        position,
        collectionId
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating collection item:', error)
    return NextResponse.json(
      { error: 'Failed to create collection item' },
      { status: 500 }
    )
  }
} 