'use server'
import { getClient } from '@/shared/lib/apollo-client'
import { revalidatePath } from 'next/cache'
import { REMOVE_PRODUCT } from './product.queries'

export async function deleteProductAction(id: number) {
  try {
    await getClient().mutate({
      mutation: REMOVE_PRODUCT,
      variables: { id: Number(id) },
    })

    revalidatePath('/products')

    return { success: true }
  } catch (error) {
    console.error('❌ Ошибка в Server Action при удалении:', error)
    return { success: false, error: 'Не удалось удалить продукт' }
  }
}
