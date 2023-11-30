import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { messageData } from "../types";
import Messages from "./Messages";


interface ParamsState {
  name?: string;
  room?: string
}

const Chat: FC = () => {
  const securityOptions = {
    secure: true,
    reconnection: true,
    rejectUnauthorized: false
  }
  const ioSocket = io('http://localhost:5000', securityOptions);
  const navigate = useNavigate();
  const { search } = useLocation()
  const [params, setParams] = useState<ParamsState>({});
  const [state, setState] = useState<messageData[]>([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState(0);


  console.log(state)

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams as ParamsState)
    ioSocket.emit('join', searchParams)
  }, [search]);

  useEffect(() => {
    ioSocket.on("message", ({ data }) => {
      setState(prev => ([...prev, data]))
    })
    ioSocket.on("room", ({ data: { users } }) => {
      setUsers(users.length);
    });
    ioSocket.on("messageHistory", ({ data: { messages } }) => {
      setState(prev => ([...prev, ...messages]));
    });
  }, []);






  const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }
  const leftRoom = () => {
    ioSocket.emit("leftRoom", { params });
    navigate("/");
  }

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!message) return

    ioSocket.emit('sendMessage', { message, params });

    setMessage('')
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="w-full bg-gray-900 flex items-center justify-between py-4 px-6 text-white">
        <div className="text-2xl font-bold">Room: {params.room}</div>
        <div>{users} users in this room</div>
        <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={leftRoom}>
          Left the room
        </button>
      </div>

      <div className="flex-grow w-full bg-gray-800 p-4 overflow-y-auto">
        <Messages messages={state} name={params.name} />

      </div>

      <form className="w-full flex justify-between bg-gray-900 p-4" onSubmit={handleSubmit}>
        <div className="flex-grow mr-4">
          <input
            type="text"
            name="message"
            placeholder="What do you want to say?"
            value={message}
            onChange={handleChangeMessage}
            autoComplete="off"
            required
            className="w-full h-full bg-gray-700 text-white px-4 py-2 rounded"
          />
        </div>

        <div className="flex items-center">
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded cursor-pointer" >Send a message</button>
        </div>
      </form>
    </div>
  )
}

export default Chat