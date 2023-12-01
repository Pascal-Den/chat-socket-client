import React, {FC} from "react";
import {ParamsState} from "../types";

type HeaderProps = {
    users: number;
    params: ParamsState;
    leftRoom: () => void;
}
const Header: FC<HeaderProps> = ({users, params, leftRoom})=> {
    return(
        <div className="w-full bg-gray-900 flex items-center justify-between py-4 px-6 text-white">
            <div className="text-2xl font-bold">Room: {params.room}</div>
            <div>{users} users in this room</div>
            <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={leftRoom}>
                Left the room
            </button>
        </div>
    )
}

export default Header