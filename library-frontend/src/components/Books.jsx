import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
    const [currentGenre, setCurrentGenre] = useState(null)
    const result = useQuery(ALL_BOOKS)

    if (result.loading) {
        return <div>loading...</div>
    }
    
    const books = result.data.allBooks
    const genres = [...new Set(books.flatMap(book => book.genres))]

    return (
        <div>
            <h2>books</h2>
    
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books
                        .filter(book => {
                            return currentGenre === null
                                ? true
                                : book.genres.includes(currentGenre)
                        })
                        .map((book) => (
                        <tr key={book.title}>
                            <td>{book.title}</td>
                            <td>{book.author.name}</td>
                            <td>{book.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={() => setCurrentGenre(null)}>all</button>
            {genres.map((genre) =>
                <button key={genre} onClick={() => setCurrentGenre(genre)}>
                    {genre}
                </button>
            )}
        </div>
    )
}

export default Books
