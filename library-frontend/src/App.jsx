import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import { Link, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Notify from './components/Notify';
import { useApolloClient } from '@apollo/client';
import Recommendations from './components/Recommendations';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('library-user-token') ?? null)
    const [error, setError] = useState(null)
    const client = useApolloClient()

    if (!token) {
        return (
            <div>
                <Notify message={error} setError={setError} />
                <LoginForm setToken={setToken} setError={setError} />
            </div>
        )
    }

    const logout = () => {
        setToken(null)
        localStorage.removeItem('library-user-token')
        client.resetStore()
    }
    
    return (
        <div>
            <Notify message={error} setError={setError} />
            <div>
                <Link to="/">
                    <button>authors</button>
                </Link>
                <Link to="/books">
                    <button>books</button>
                </Link>
                <Link to="/newbook">
                    <button>add book</button>
                </Link>
                <Link to="/recommendations">
                    <button>recommendations</button>
                </Link>
                <button style={{ marginLeft: 30 }} onClick={logout}>log out</button>
            </div>

            <Routes>
                <Route path="/" element={<Authors />} />
                <Route path="/books" element={<Books />} />
                <Route path="/newbook" element={<NewBook setError={setError} />} />
                <Route path="/recommendations" element={<Recommendations />} />
            </Routes>
        </div>
    )
}

export default App
