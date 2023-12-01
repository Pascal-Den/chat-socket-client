import React, { useState, ChangeEvent, MouseEvent } from "react";
import AuthForm from "./form/AuthForm";

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
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleClick = () => {
    setError('')
    const isAnyFieldEmpty = Object.values(values).some((value) => !value);


    if (isAnyFieldEmpty) {
      setError('Please fill in all fields')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg">
        <h1 className="text-3xl font-semibold text-white mb-6">Join</h1>

        <AuthForm error={error} name={values.name} room={values.room} handleChange={handleChange} handleClick={handleClick}/>
      </div>
    </div>
  );
};

export default Main;