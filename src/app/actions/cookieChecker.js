"use server";
import { cookies } from "next/headers";

export default async function checkSessionCookie() {
  const cookie = cookies().get("token");
  if (cookie) {
    return true;
  } else {
    return false;
  }
}
