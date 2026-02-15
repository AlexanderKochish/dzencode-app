import { gql } from '@apollo/client'

export const GET_ORDERS = gql`
  query GetOrders($limit: Int, $offset: Int) {
    orders(limit: $limit, offset: $offset) {
      items {
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
      totalCount
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
