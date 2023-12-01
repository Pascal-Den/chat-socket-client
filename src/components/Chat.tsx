import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import {messageData, ParamsState} from "../types";
import Messages from "./Messages";
import ChatForm from "./form/ChatForm";
import Header from "./Header";


const Chat: FC = () => {
  const securityOptions = {
    secure: true,
    reconnection: true,
    rejectUnauthorized: false
  }
  const [ioSocket] = useState(() => io('http://localhost:5001', securityOptions));

  const navigate = useNavigate();
  const { search } = useLocation()
  const [params, setParams] = useState<ParamsState>({});
  const [messages, setMessages] = useState<messageData[]>([]);
  const [message, setMessage] = useState('');
  const [disconnect, setDisconnect] = useState(false)
  const [users, setUsers] = useState(0);
  const [initialHistoryFetched, setInitialHistoryFetched] = useState(false);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams)
    ioSocket.emit('join', searchParams);

  }, [search, ioSocket]);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    ioSocket.emit('join', searchParams);


    if (!initialHistoryFetched) {
      ioSocket.on("messageHistory", ({ data: { messages } }) => {
        setMessages(messages);
        setInitialHistoryFetched(true);
      });
    }
  }, [search, ioSocket, initialHistoryFetched]);


  useEffect(() => {
    ioSocket.on("message", ({ data }) => {
      setMessages(prev => ([...prev, data]))
    })

    ioSocket.on("connect", () => {
      setDisconnect(false);
    })

    ioSocket.on("disconnect", ()=> {
      setDisconnect(true)
    })

    ioSocket.on("room", ({ data: { users } }) => {
      setUsers(users.length);
    });

    return () => {
      ioSocket.off("message");
      ioSocket.off("messageHistory");
      ioSocket.off("connect");
      ioSocket.off("disconnect");
      ioSocket.off("room");
    };
  }, [ioSocket]);






  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }
  const leftRoom = () => {
    ioSocket.emit("leftRoom", { params });
    navigate("/");
  }

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    const name = params.name
    e.preventDefault()
    if (!message || !name) return
    ioSocket.emit('sendMessage', { message, params });
    setMessages((prev) => [...prev, {user: {name}, message}])
    setMessage('')
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <Header users={users} params={params} leftRoom={leftRoom} />

      <div className="flex-grow w-full bg-gray-800 p-4 overflow-y-auto">
        <Messages messages={messages} name={params.name} />
      </div>

        <ChatForm disconnect={disconnect} handleSubmit={handleSubmit} handleChangeMessage={handleChangeMessage} message={message}/>
    </div>
  )
}

export default Chat