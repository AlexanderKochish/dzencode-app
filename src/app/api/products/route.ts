import { NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma'

export async function GET() {
  try {
    const orders = await prisma.product.findMany({
      include: {
        order: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Request error', error)
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 }
    )
  }
}
