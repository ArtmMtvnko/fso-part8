import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from '../queries'

const Recommendations = () => {
    const resultUser = useQuery(CURRENT_USER)
    const resultBooks = useQuery(ALL_BOOKS)

    if (resultUser.loading || resultBooks.loading) {
        return <div>loading...</div>
    }
    
    const favoriteGenre = resultUser.data.me.favoriteGenre
    const books = resultBooks.data.allBooks

    return (
        <div>
            <h3>books in your favorite genre: <b>{favoriteGenre}</b></h3>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books
                        .filter(book => book.genres.includes(favoriteGenre))
                        .map((book) => (
                        <tr key={book.title}>
                            <td>{book.title}</td>
                            <td>{book.author.name}</td>
                            <td>{book.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Recommendations
