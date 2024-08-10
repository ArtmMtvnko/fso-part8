require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')
const Book = require('./src/models/book')
const Author = require('./src/models/author')

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

// let authors = [
//     {
//         name: 'Robert Martin',
//         id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//         born: 1952,
//     },
//     {
//         name: 'Martin Fowler',
//         id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//         born: 1963
//     },
//     {
//         name: 'Fyodor Dostoevsky',
//         id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//         born: 1821
//     },
//     { 
//         name: 'Joshua Kerievsky', // birthyear not known
//         id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//     },
//     { 
//         name: 'Sandi Metz', // birthyear not known
//         id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//     },
// ]

// let books = [
//     {
//         title: 'Clean Code',
//         published: 2008,
//         author: 'Robert Martin',
//         id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Agile software development',
//         published: 2002,
//         author: 'Robert Martin',
//         id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//         genres: ['agile', 'patterns', 'design']
//     },
//     {
//         title: 'Refactoring, edition 2',
//         published: 2018,
//         author: 'Martin Fowler',
//         id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Refactoring to patterns',
//         published: 2008,
//         author: 'Joshua Kerievsky',
//         id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'patterns']
//     },  
//     {
//         title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//         published: 2012,
//         author: 'Sandi Metz',
//         id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'design']
//     },
//     {
//         title: 'Crime and punishment',
//         published: 1866,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'crime']
//     },
//     {
//         title: 'Demons',
//         published: 1872,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'revolution']
//     },
// ]

const typeDefs = `
    type Author {
        name: String!
        born: Int
        bookCount: Int!
        id: ID
    }

    type Book {
        title: String!
        author: Author!
        published: Int!
        genres: [String!]!
        id: ID
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook (
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        editAuthor (name: String!, setBornTo: Int!): Author
    }
`

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            const books = await Book.find({})
            
            if (!args) return books

            let filtered = books // [...books] ==> books

            if (args.author) {
                filtered = filtered.filter(book => book.author === args.author)
            }

            if (args.genre) {
                filtered = filtered.filter(book => book.genres.includes(args.genre))
            }
            
            return filtered
        },
        allAuthors: async () => Author.find({})
    },
    Mutation: {
        addBook: async (root, args) => {
            // const author = authors.some(a => a.name === args.author)
            let author = await Author.findOne({ name: args.author })

            if (!author) {
                author = new Author({ name: args.author })
                await author.save()
                // authors = authors.concat({ name: args.author, id: uuid() })
            }

            const book = {
                title: args.title,
                published: args.published,
                author: author._id,
                id: uuid(),
                genres: args.genres
            }
            // TODO: To check if all code that was written is works (may be a rollback has to be done, git reset/revert)
            const newBook = new Book(book)
            return newBook.save()

            // books = books.concat(book)
            // return book
        },
        editAuthor: (root, args) => {
            const author = authors.find(a => a.name === args.name)

            if (!author) return null

            const editedAuthor = {
                ...author,
                born: args.setBornTo
            }

            authors = authors.map(a => a.id === author.id ? editedAuthor : a)

            return editedAuthor
        }
    },
    Author: {
        bookCount: (root) =>
            books.reduce((acc, book) => {
                return book.author === root.name ? acc + 1 : acc
            }, 0)
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

startStandaloneServer(server, {
    listen: { port: 4000 }
}).then(({ url }) => {
    console.log(`Server is ready at ${url}`)
})
