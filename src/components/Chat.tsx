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
  const [ioSocket] = useState(() => io('http://localhost:5000', securityOptions));

  const navigate = useNavigate();
  const { search } = useLocation()
  const [params, setParams] = useState<ParamsState>({});
  const [state, setState] = useState<messageData[]>([]);
  const [message, setMessage] = useState('');
  const [disconnect, setDisconnect] = useState(false)
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams)
    ioSocket.emit('join', searchParams)
  }, [search, ioSocket]);


  useEffect(() => {
    ioSocket.on("message", ({ data }) => {
      setState(prev => ([...prev, data]))
    })

    ioSocket.on("messageHistory", ({ data: { messages } }) => {
      setState(prev => ([...prev, ...messages]));
    });

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

        <button
            type="submit"
            className={`py-2 px-4 rounded cursor-pointer ${
                disconnect ? 'bg-gray-400 text-gray-600' : 'bg-blue-600 text-white'
            }`}
            disabled={disconnect}
        >
          Send a message
        </button>
      </form>
    </div>
  )
}

export default Chat