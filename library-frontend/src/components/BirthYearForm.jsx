import { useMutation } from '@apollo/client'
import { useField } from '../hooks/useField'
import { ALL_AUTHORS, EDIT_AUTHOR_BIRTH } from '../queries'

const BirthYearForm = () => {
    const [name, resetName] = useField('text')
    const [born, resetBorn] = useField('number')

    const [ EditAuthorBirth ] = useMutation(EDIT_AUTHOR_BIRTH, {
        refetchQueries: [ { query: ALL_AUTHORS } ]
    })

    const updateBirthYear = (event) => {
        event.preventDefault()

        EditAuthorBirth({
            variables: {
                name: name.value,
                born: Number(born.value)
            }
        })

        resetName()
        resetBorn()
    }
    
    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={updateBirthYear}>
                <div>
                    name
                    <input {...name} />
                </div>
                <div>
                    born
                    <input {...born} />
                </div>
                <button type="submit">update author</button>
            </form>
        </div>
    )
}

export default BirthYearForm
