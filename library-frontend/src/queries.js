import { gql } from '@apollo/client';

const AUTHOR_DETAILS = gql`
    fragment AuthorDetails on Author {
        name
        born
        bookCount
    }
`

export const ALL_AUTHORS = gql`
    query AllAuthors {
        allAuthors {
            ...AuthorDetails
        }
    }

    ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
    query AllBooks ($author: String, $genre: String) {
        allBooks (
            author: $author,
            genre: $genre
        ) {
            title
            author {
                ...AuthorDetails
            }
            published
            genres
        }
    }

    ${AUTHOR_DETAILS}
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

export const CURRENT_USER = gql`
    query CurrentUser {
        me {
            favoriteGenre
        }
    }
`
