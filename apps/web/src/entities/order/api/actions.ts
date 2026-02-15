'use server'
import { getClient } from '@/shared/lib/apollo-client'
import { revalidatePath } from 'next/cache'
import { REMOVE_ORDER } from './orders.queries'

export async function deleteOrderAction(id: number) {
  try {
    await getClient().mutate({
      mutation: REMOVE_ORDER,
      variables: { id: Number(id) },
    })

    revalidatePath('/orders')

    return { success: true }
  } catch (error) {
    console.error('❌ Ошибка в Server Action при удалении:', error)
    return { success: false, error: 'Не удалось удалить продукт' }
  }
}
