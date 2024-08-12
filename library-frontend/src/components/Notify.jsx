import { useEffect } from 'react'

const Notify = ({ message, setError }) => {
    if (message === null) return null

    const styles = {
        padding: '0 20px',
        fontSize: 24,
        backgroundColor: '#ebc0c0',
        border: '1px solid #f0adad'
    }

    useEffect(() => {
        setTimeout(() => {
            setError(null)
        }, 4000)
    }, [])
    
    return (
        <div style={styles}>
            <p>{message}</p>
        </div>
    )
}

export default Notify
