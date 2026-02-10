import { NextResponse } from 'next/server'
import { prisma } from '@/shared/lib/prisma'

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: true,
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
