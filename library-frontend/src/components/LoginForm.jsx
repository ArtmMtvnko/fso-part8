import { useMutation } from '@apollo/client'
import { useField } from '../hooks/useField'
import { LOGIN } from '../queries'
import { useEffect } from 'react'

const LoginForm = ({ setToken, setError }) => {
    const [login, resetLogin] = useField('text')
    const [password, resetPassword] = useField('text')

    const [fetchToken, result] = useMutation(LOGIN, {
        onError: (error) => {
            console.error(error)
            setError(error.graphQLErrors[0].message)
        }
    })

    const handleLogin = async (event) => {
        event.preventDefault()

        fetchToken({
            variables: {
                username: login.value,
                password: password.value
            }
        })
        
        resetLogin()
        resetPassword()
    }

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
        }
    }, [result.data])
    
    return (
        <form onSubmit={handleLogin}>
            <div>
                login
                <input {...login} />
            </div>
            <div>
                password
                <input {...password} />
            </div>
            <button type="submit">login</button>
        </form>
    )
}

export default LoginForm
