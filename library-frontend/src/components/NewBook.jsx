import { useState } from 'react'
import { useField } from '../hooks/useField'
import { useMutation, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, BOOK_ADDED } from '../queries'

const NewBook = ({ setError }) => {
    const [genres, setGenres] = useState([])

    const [title, resetTitle] = useField('text')
    const [author, resetAuthor] = useField('text')
    const [published, resetPublished] = useField('number')
    const [genre, resetGenre] = useField('text')

    const [ createBook ] = useMutation(CREATE_BOOK, {
        refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        },
        // update: (cache, response) => {
        //     cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        //         return {
        //             allBooks: allBooks.concat(response.data.addBook)
        //         }
        //     })
        //     cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        //         return {
        //             allAuthors: allAuthors.concat(response.data.addBook.author)
        //         }
        //     })
        // }
    })


    const submit = async (event) => {
        event.preventDefault()

        createBook({
            variables: {
                title: title.value,
                author: author.value,
                published: Number(published.value),
                genres: genres
            }
        })

        resetTitle()
        resetPublished()
        resetAuthor()
        resetGenre()
        setGenres([])
    }

    const addGenre = () => {
        setGenres(genres.concat(genre.value))
        resetGenre('')
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input {...title} />
                </div>
                <div>
                    author
                    <input {...author} />
                </div>
                <div>
                    published
                    <input {...published} />
                </div>
                <div>
                    <input {...genre} />
                    <button onClick={addGenre} type="button">add genre</button>
                </div>
                <div>genres: {genres.join(' ')}</div>
                <button type="submit">create book</button>
            </form>
        </div>
    )
}

export default NewBook
