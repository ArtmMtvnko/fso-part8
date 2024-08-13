import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
    query AllAuthors {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query AllBooks {
        allBooks {
            title
            author {
                name
                born
                bookCount
            }
            published
            genres
        }
    }
`

export const CREATE_BOOK = gql`
    mutation CreateNewBook (
        $title: String!,
        $author: String!,
        $published: Int!,
        $genres: [String!]!
    ) {
        addBook (
            title: $title,
            author: $author,
            published: $published,
            genres: $genres
        ) {
            title
            author {
                name
            }
            published
        }
    }
`

export const EDIT_AUTHOR_BIRTH = gql`
    mutation EditAuthorBirthYear ($name: String!, $born: Int!) {
        editAuthor (name: $name, setBornTo: $born) {
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`
