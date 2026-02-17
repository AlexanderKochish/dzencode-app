import { gql } from '@apollo/client'

export const GET_TRANSLATIONS = gql`
  query GetTranslations($locale: String!, $namespace: String) {
    translations(locale: $locale, namespace: $namespace) {
      key
      value
      namespace
      locale
    }
  }
`
