import React from "react";
import { Dash } from "../ui/dashboard";
import checkSessionCookie from "../actions/cookieChecker";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const isValid = await checkSessionCookie();

  if (isValid) {
    return (
      <div className="dash-page">
        {/*<h1>Welcome!</h1>*/}
        <Dash />
      </div>
    );
  } else {
    redirect("/");
  }
}
