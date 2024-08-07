import { useState } from 'react'
import { useField } from '../hooks/useField'

const NewBook = (props) => {
    const [genres, setGenres] = useState([])

    const [title, resetTitle] = useField('text')
    const [author, resetAuthor] = useField('text')
    const [published, resetPublished] = useField('number')
    const [genre, resetGenre] = useField('text')

    if (!props.show) {
        return null
    }

    const submit = async (event) => {
        event.preventDefault()

        console.log('add book...')

        resetTitle()
        resetPublished()
        resetAuthor()
        resetGenre()
        setGenres([])
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
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
