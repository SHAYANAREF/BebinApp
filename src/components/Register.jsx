import React, { useState } from 'react';
import routes from '../routes';
import NeonMenu from './NeonMenu';
import { supabase } from '../supabaseClient';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      console.log(data);
      alert('Registration successful!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NeonMenu routes={routes} />
      <h1 className="text-4xl font-bold text-neonBlue">Register</h1>
      <p className="text-xl mt-4">Please register to continue.</p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mt-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mt-4"
        />
        <button type="submit" className="bg-neonBlue text-white rounded-md px-4 py-2 mt-4">Register</button>
      </form>
    </div>
  );
};

export default Register;
