import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import { Link, Route, Routes } from 'react-router-dom';

const App = () => {
    return (
        <div>
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
            </div>

            <Routes>
                <Route path="/" element={<Authors />} />
                <Route path="/books" element={<Books />} />
                <Route path="/newbook" element={<NewBook />} />
            </Routes>
        </div>
    )
}

export default App
