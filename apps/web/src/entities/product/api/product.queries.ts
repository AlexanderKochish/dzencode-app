import { gql } from '@apollo/client'

export const GET_PRODUCTS = gql`
  query GetProducts($type: String) {
    products(type: $type) {
      id
      serialNumber
      isNew
      photo
      title
      type
      specification
      date
      guarantee {
        start
        end
      }
      price {
        value
        symbol
        isDefault
      }
      order {
        id
        title
      }
    }
  }
`
export const REMOVE_PRODUCT = gql`
  mutation RemoveProduct($id: Int!) {
    removeProduct(id: $id) {
      id
    }
  }
`
