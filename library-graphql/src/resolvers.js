const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')


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
        addBook: async (root, args, context) => {
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
                    throw new GraphQLError('Creating an author is failed. Min lenght must be 4', {
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
    
                return createdBook.populate('author')
            } catch (error) {
                throw new GraphQLError('Creating a book is failed. Min lenght must be 5', {
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

module.exports = resolvers
