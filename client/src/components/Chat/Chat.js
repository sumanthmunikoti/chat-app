import React, {useEffect, useState} from "react"
import queryString from 'query-string'
import io from 'socket.io-client'

let socket

const Chat = ({location}) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const ENDPOINT = 'localhost:5000'

    useEffect(() => {
        //acts like componentDidUpdate and componentDidMount
        const {name, room} = queryString.parse(location.search)
        socket = io(ENDPOINT)

        setName(name)
        setRoom(room)

        socket.emit('join', {name, room}, ({error}) => {
            alert(error)
        })

        return () => {
            socket.emit('disconnect')
            socket.off()
        }

    }, [location.search, ENDPOINT])

    useEffect(() => {
        socket.on('message', () => {
            setMessages([...messages, message])
        })
    }, [messages])

    const sendMessage = (e) => {
        e.preventDefault()

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <input value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}/>
            </div>
        </div>
    )
}

export default Chat
