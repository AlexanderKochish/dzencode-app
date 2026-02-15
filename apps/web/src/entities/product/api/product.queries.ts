import { gql } from '@apollo/client'

export const GET_PRODUCTS = gql`
  query GetProducts($limit: Int, $offset: Int, $type: String) {
    products(limit: $limit, offset: $offset, type: $type) {
      items {
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
      totalCount
    }
    productTypes
  }
`
export const REMOVE_PRODUCT = gql`
  mutation RemoveProduct($id: Int!) {
    removeProduct(id: $id) {
      id
    }
  }
`
