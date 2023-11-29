import React, { useState, ChangeEvent, MouseEvent } from "react";
import { Link } from "react-router-dom";

interface FieldValues {
  name: string;
  room: string;
}

const Main: React.FC = () => {
  const initialFieldValues: FieldValues = {
    name: "",
    room: "",
  };

  const [values, setValues] = useState<FieldValues>(initialFieldValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const isAnyFieldEmpty = Object.values(values).some((value) => !value);

    if (isAnyFieldEmpty) {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg">
        <h1 className="text-3xl font-semibold text-white mb-6">Join</h1>

        <form className="flex flex-col gap-3">
          <div className="min-w-[320px] rounded-lg h-12 overflow-hidden">
            <input
              type="text"
              name="name"
              value={values.name}
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
              value={values.room}
              className="w-full h-full bg-gray-700 text-white pl-5 text-base"
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          <Link
            className="min-w-[320px] rounded-lg h-12 overflow-hidden"
            onClick={handleClick}
            to={`/chat?name=${values.name}&room=${values.room}`}
          >
            <button type="submit" className="w-full h-full bg-blue-600 text-white text-base font-semibold">
              Sign In
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Main;