"use server";
import { cookies } from "next/headers";

export default async function checkSessionCookie() {
  // TODO: add better checks of contents of the token
  const cookie = cookies().get("token");
  if (cookie) {
    return true;
  } else {
    return false;
  }
}
