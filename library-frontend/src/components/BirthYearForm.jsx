import { useMutation } from '@apollo/client'
import { useField } from '../hooks/useField'
import { ALL_AUTHORS, EDIT_AUTHOR_BIRTH } from '../queries'
import Select from 'react-select'
import { useState } from 'react'

const BirthYearForm = ({ authors }) => {
    const [name, setName] = useState(null)
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

        resetBorn()
    }

    const options = authors.map(author => {
        return { value: author.name, label: author.name }
    })
    
    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={updateBirthYear}>
                <Select 
                    defaultValue={name}
                    onChange={setName}
                    options={options}
                />
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
