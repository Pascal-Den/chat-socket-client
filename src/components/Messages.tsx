import { FC } from "react";
import { messageData } from "../types";

type MessagesProps = {
    messages?: messageData[],
    name?: string
}

const Messages: FC<MessagesProps> = ({ messages, name }) => {
    return (
        <div className="flex flex-col gap-4">
            {messages?.map(({ user, message }, i) => {
                const itsMe =
                    user.name.trim().toLowerCase() === name?.trim().toLowerCase();

                const adminClass = user.name === '' ? 'self-center p-2' : "";
                const messageClassName = itsMe
                    ? "self-end bg-blue-500 "
                    : "self-start bg-gray-700 ";
                const textClassName = "p-4 rounded-xl text-white";

                if (!message) return null;

                return (
                    <div key={i} className={`flex flex-col min-w-[200px] ${messageClassName} ${textClassName} ${adminClass}`}>
                        <span className="text-sm text-[#111727]">{user.name}</span>
                        <div>{message}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default Messages;