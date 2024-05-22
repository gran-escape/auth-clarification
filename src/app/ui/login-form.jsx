"use client";

import { useState } from "react";
import { checkLogin, registerUser } from "../actions/auth";

export function Login() {
  const [formState, formUpdate] = useState({
    username: "",
    password: "",
    message: "please login",
  });

  async function update(e) {
    const target = e.target.id;
    const value = e.target.value;

    console.log(target);
    console.log(value);
    formUpdate((prevValue) => {
      return { ...prevValue, [target]: value };
    });
  }

  async function login() {
    const { status, message } = await checkLogin(formState);
    console.log(`status: ${status}\tmessage: ${message}`);
    formUpdate((prevValue) => {
      return { ...prevValue, message: message };
    });
  }

  async function register() {
    console.log("register user");
    const { message } = await registerUser(formState);
    formUpdate((prevValue) => {
      return { ...prevValue, message: message };
    });
  }

  return (
    <div>
      <form action={login}>
        <label htmlFor="username">Username </label>
        <input
          onChange={update}
          type="text"
          name="username"
          id="username"
          value={formState.username}
        />
        <label htmlFor="password">Password </label>
        <input
          onChange={update}
          type="password"
          name="password"
          id="password"
          value={formState.password}
        />
        <button type="submit">Login</button>
        <button type="button" onClick={register}>
          Register
        </button>
      </form>
      <p>{formState.message}</p>
    </div>
  );
}
