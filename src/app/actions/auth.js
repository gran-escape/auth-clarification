"use server";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify, jwtDecrypt } from "jose";
import bcrypt from "bcrypt";
import { Client } from "pg";

const db = new Client({
  user: "postgres",
  port: 5432,
  host: "localhost",
  password: process.env.DB_LOGIN,
  database: "invoices",
});

db.connect();

const SECRET_KEY = new TextEncoder().encode(process.env.SESSION_SECRET);

/**
 * takes encrypted token and puts it into a cookie for
 * the user to use.
 * @param {string} payload
 */
export async function makeCookie(payload) {
  const expiresAt = new Date(Date.now() + 60);

  cookies().set("token", payload, {
    maxAge: 60 * 10,
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function decryptToken(payload) {
  const contents = await jwtVerify(payload, SECRET_KEY, {
    algorithms: ["HS256"],
  });
  console.log(contents);
}

/**
 * takes in payload which is the info wanted inside of the cookie,
 * sign and encrypts it. returns it over to the calling function
 * to finish making the cookie.
 * @param {String} payload
 * @returns token
 */
export async function signToken(payload) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(SECRET_KEY);

  console.log(jwt);
  return jwt;
}

/**
 * checks user credentials against what is in the database. if it
 * is correct, a cookie is created with basic info and function is
 * called to make sign token, then make cookie.
 * @param {username, password} param
 * @returns status
 */
export async function checkLogin({ username, password }) {
  console.log(`checking for user ${username} and here is password ${password}`);
  const response = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (response.rowCount > 0) {
    // get id username password
    const {
      id,
      username: foundUsername,
      password: foundPassword,
    } = response.rows[0];

    if (await bcrypt.compare(password, foundPassword)) {
      // TODO: delete this later on
      const token = await signToken({ id: id, username: foundUsername });
      makeCookie(token);
      return { status: true, message: "login accepted!" };
    } else {
      return { status: true, message: "incorrect password..." };
    }
  } else {
    console.log("no username is found here");
    return { status: false, message: "user is not found... please register" };
  }
}

/**
 * function that takes the username and password field from the login screen
 * and attempts to add them to the user database. this also includes some very
 * basic validation (need to fix!) and error catching.
 *
 * @param {username, password} param
 * @returns message
 */
export async function registerUser({ username, password }) {
  // Normally would send through something for form validation
  if (username.length > 5 && password.length > 5) {
    console.log("close enough!");
    try {
      // encrypt password
      const encryptedPass = await bcrypt.hash(password, 10);

      // send to database, get unique id back
      const returnId = await db.query(
        "INSERT INTO users(username, password) VALUES($1,$2) RETURNING id",
        [username, encryptedPass]
      );

      // get returned id
      const { id: userId } = returnId.rows[0];
      console.log(`[user add] user ${userId} has been added`);

      // won't really need this since it should redirect, not return error/ message
      return { message: "user added!" };
    } catch (error) {
      // if error, return a message to client
      console.log("error adding user to database ", error);
      return {
        message:
          "error adding user to database. username likely already exists",
      };
    }
  } else {
    // return errors for better password or username
    console.log("please fix username or password to max 5 characters each");
    return {
      message: "please fix username or password to max 5 characters each",
    };
  }
}
