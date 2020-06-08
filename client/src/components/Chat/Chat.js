import React, {useEffect, useState} from "react"
import queryString from 'query-string'
import io from 'socket.io-client'
import Editor, { ControlledEditor } from "@monaco-editor/react";
import './Chat.css'
import InfoBar from "../Infobar/Infobar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import SplitPane, { Pane }  from 'react-split-pane';

let socket

const Chat = ({ location }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [code, setCode] = useState('')
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

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
    }, [messages])

    useEffect(() => {
        socket.on('code', (code) => {
            console.log(code)
            setCode(code)
        })
    }, [])

    const sendMessage = (e) => {
        e.preventDefault()

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    const sendCode = (value) => {
        socket.emit('sendCode', value, () => {
            // console.log('Code delivered')
        })
    }


    const BAD_WORD = "eval";
    const WARNING_MESSAGE = " <- hey man, what's this?";

    const handleEditorChange = (ev, value) => {
        sendCode(value)
        // console.log(value)
        // return value.includes(BAD_WORD) && !value.includes(WARNING_MESSAGE)
        //   ? value.replace(BAD_WORD, BAD_WORD + WARNING_MESSAGE)
        //   : value.includes(WARNING_MESSAGE) && !value.includes(BAD_WORD)
        //     ? value.replace(WARNING_MESSAGE, "")
        //     : value;
      }

    return (
        <div>
            <SplitPane split="vertical" minSize={50} defaultSize={700}>
                <Pane initialSize="50%" minSize="10%" maxSize="500px" className="">
                <h3>Type your code here</h3>
                <ControlledEditor
                    height="90vh"
                    value={code.text}
                    onChange={handleEditorChange}/>
                </Pane>

                <Pane initialSize="50%" minSize="10%" maxSize="500px" className="">
                <Messages messages={messages} name={name}/>
                <InfoBar room={room}/>
                <h3>Type your messages here</h3>
                <input value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null}/>
                </Pane>
            </SplitPane>
        </div>
    )
}

export default Chat
