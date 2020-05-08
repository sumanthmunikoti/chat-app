import React, {useEffect, useState} from "react"
import queryString from 'query-string'
import io from 'socket.io-client'
import {ControlledEditor} from "@monaco-editor/react";

let socket

const Chat = ({ location }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const ENDPOINT = 'localhost:5000'

    useEffect(() => {
        //acts like componentDidUpdate and componentDidMount
        const { name, room } = queryString.parse(location.search)
        socket = io(ENDPOINT)

        setRoom(room)
        setName(name)


        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error);
            }
        });
    }, [ENDPOINT, location.search]);

    //     return () => {
    //         socket.emit('disconnect')
    //         socket.off()
    //     }
    // }, [location.search, ENDPOINT])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
    }, [messages])

    const sendMessage = (e) => {
        e.preventDefault()

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages)

    const BAD_WORD = "eval";
    const WARNING_MESSAGE = " <- hey man, what's this?";

    const handleEditorChange = (e, value) => {
        setMessage(
            value.includes(BAD_WORD) && !value.includes(WARNING_MESSAGE)
            ? value.replace(BAD_WORD, BAD_WORD + WARNING_MESSAGE)
            : value.includes(WARNING_MESSAGE) && !value.includes(BAD_WORD)
              ? value.replace(WARNING_MESSAGE, "")
              : value
        );
    };

    return (
        <div className="outerContainer">
            <div className="container">
                <ControlledEditor height="90vh"
                                  value={message}
                                  onChange={handleEditorChange}
                                  onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}
                />
                <input value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}/>
            </div>
        </div>
    )
}

export default Chat
