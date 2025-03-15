import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/db'
import { startOfWeek, endOfWeek, format } from 'date-fns'

export async function GET() {
  try {
    const lists = await prisma.list.findMany({
      include: {
        items: {
          orderBy: {
            position: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(lists)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching lists' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const today = new Date()
    const weekStart = startOfWeek(today)
    const weekEnd = endOfWeek(today)
    
    const title = data.title || `${format(today, 'yyyy')} W${format(today, 'w')} - ${format(weekStart, 'MMM d')}-${format(weekEnd, 'MMM d')}`
    
    const list = await prisma.list.create({
      data: {
        title
      },
      include: {
        items: true // Include the items (will be empty for new list)
      }
    })
    
    return NextResponse.json(list)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating list' }, { status: 500 })
  }
} 