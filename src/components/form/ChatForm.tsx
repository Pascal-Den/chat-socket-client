import React, {ChangeEvent, FC} from "react";

type ChatFormProps = {
    handleSubmit: (e: ChangeEvent<HTMLFormElement>) => void;
    handleChangeMessage: (e: ChangeEvent<HTMLInputElement>) => void;
    message: string;
    disconnect: boolean
}
const ChatForm: FC<ChatFormProps> = ({handleChangeMessage, message, handleSubmit, disconnect}) => {
    return(  <form className="w-full flex justify-between bg-gray-900 p-4" onSubmit={handleSubmit}>
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
    </form>)
}

export default ChatForm;