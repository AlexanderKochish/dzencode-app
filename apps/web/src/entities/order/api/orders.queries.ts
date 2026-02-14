import { gql } from '@apollo/client'

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      title
      date
      description
      total {
        value
        symbol
      }
      products {
        id
        title
        price {
          value
          symbol
        }
      }
    }
  }
`

export const REMOVE_ORDER = gql`
  mutation RemoveOrder($id: Int!) {
    removeOrder(id: $id) {
      id
    }
  }
`
