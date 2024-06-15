import React from "react";
import EditComponent from "../components/EditComponent";
import checkSessionCookie from "../actions/cookieChecker";
import { redirect } from "next/navigation";

export default async function Edit() {
  const isValid = await checkSessionCookie();

  if (isValid) {
    return <EditComponent />;
  } else {
    redirect("/");
  }
}
