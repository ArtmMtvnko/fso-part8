require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('./src/models/user')
const typeDefs = require('./src/schema')
const resolvers = require('./src/resolvers')

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

const TRIAL_PASSWORD = 'qwerty123'

const start = async () => {
    const app = express()
    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        schema: makeExecutableSchema({ typeDefs, resolvers }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    })

    await server.start()

    app.use(
        '/',
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const auth = req ? req.headers.authorization : null

                if (auth && auth.startsWith('Bearer ')) {
                    const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)

                    const currentUser = await User.findById(decodedToken.id)
                    return { currentUser }
                }
            }
        })
    )

    const PORT = 4000

    httpServer.listen(PORT, () => {
        console.log(`Server in now running on http://localhost:${PORT}`)
    })
}

start()
