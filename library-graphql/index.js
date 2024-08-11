require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Book = require('./src/models/book')
const Author = require('./src/models/author')
const User = require('./src/models/user')

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

const TRIAL_PASSWORD = 'hardcoded-for-tutorial-123'

const typeDefs = `
    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }

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
        me: User
    }

    type Mutation {
        addBook (
            title: String!
            author: String!
            published: Int!
            genres: [String!]!
        ): Book
        editAuthor (name: String!, setBornTo: Int!): Author
        createUser (
            username: String!
            favoriteGenre: String!
        ): User
        login (
            username: String!
            password: String!
        ): Token
    }
`

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            if (!args) {
                return Book.find({})
            }

            const query = {}

            if (args.author) {
                const author = await Author.findOne({ name: args.author })
                query.author = author._id
            }

            if (args.genre) {
                // If array has primary value types, it will automaticly looks for in array.
                // So that { genres: 'comedy' } will return entrie if array ['drama', 'comedy', 'action'] has value 'comdey'
                // Otherwise, use { genres: { $elemMatch: { name: 'some-name', age: 100 } } } syntax.
                // For primary values use { genres: { $elemMatch: { $eq: 'comedy' } } }
                query.genres = { $in: [args.genre] }
            }
            
            return Book.find(query).populate('author')
        },
        allAuthors: async () => Author.find({}),
        me: (root, args, context) => context.currentUser
    },
    Mutation: {
        createUser: async (root, args) => {
            const user = new User({
                username: args.username,
                favoriteGenre: args.favoriteGenre
            })

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== TRIAL_PASSWORD) {
                throw new GraphQLError('wrong credentials', {
                    extensions: { code: 'BAD_USER_INPUT' }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id
            }

            return {
                value: jwt.sign(userForToken, process.env.JWT_SECRET)
            }
        },
        addBook: async (root, args) => {
            if (context.currentUser === null) {
                throw new GraphQLError('Authorization failed', {
                    code: 'UNAUTHORIZED'
                })
            }
            
            let author = await Author.findOne({ name: args.author })

            if (!author) {
                try {
                    author = new Author({ name: args.author })
                    await author.save()
                } catch (error) {
                    throw new GraphQLError('Creating an author is failed.', {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.author,
                        error
                    })
                }
            }
            const book = new Book({
                title: args.title,
                published: args.published,
                author: author._id,
                genres: args.genres
            })

            try {
                const createdBook = await book.save()
    
                author.books = author.books.concat(createdBook._id)
                await author.save()
    
                return createdBook
            } catch (error) {
                throw new GraphQLError('Creating a book is failed.', {
                    code: 'BAD_USER_INPUT',
                    invalidArgs: args,
                    error
                })
            }
        },
        editAuthor: async (root, args, context) => {
            if (context.currentUser === null) {
                throw new GraphQLError('Authorization failed', {
                    code: 'UNAUTHORIZED'
                })
            }
            
            const author = await Author.findOne({ name: args.name })

            if (!author) return null

            author.born = args.setBornTo

            return author.save()
        }
    },
    Author: {
        bookCount: (root) => root.books.length
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        // It automaticly cuts the part 'Bearer '
        if (auth) {
            const decodedToken = jwt.verify(auth, process.env.JWT_SECRET)

            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
        }
    }
}).then(({ url }) => {
    console.log(`Server is ready at ${url}`)
})
