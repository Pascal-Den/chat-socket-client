import React, { ChangeEvent, MouseEvent, FC } from "react";
import { Link } from "react-router-dom";

type AuthFormProps = {
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleClick: () => void;
    name: string;
    room: string;
    error: string;
};

const AuthForm: FC<AuthFormProps> = ({ handleChange, handleClick, name, room, error }) => {
    return (
        <form className="flex flex-col gap-3">
            <div className="min-w-[320px] rounded-lg h-12 overflow-hidden">
                <input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="Username"
                    className="w-full h-full bg-gray-700 text-white pl-5 text-base"
                    onChange={handleChange}
                    autoComplete="off"
                    required
                />
            </div>
            <div className="min-w-[320px] rounded-lg h-12 overflow-hidden">
                <input
                    type="text"
                    name="room"
                    placeholder="Room"
                    value={room}
                    className="w-full h-full bg-gray-700 text-white pl-5 text-base"
                    onChange={handleChange}
                    autoComplete="off"
                    required
                />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <Link
                className="min-w-[320px] rounded-lg h-12 overflow-hidden"
                to={`/chat?name=${name}&room=${room}`}
            >
                <button
                    type="submit"
                    className="w-full h-full bg-blue-600 text-white text-base font-semibold"
                    onClick={handleClick}
                >
                    Sign In
                </button>
            </Link>
        </form>
    );
};

export default AuthForm;