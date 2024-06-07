import React from "react";
import Review from "../components/Review";
import checkSessionCookie from "../actions/cookieChecker";
import { redirect } from "next/navigation";

export default async function Page() {
  const isValid = await checkSessionCookie();
  if (isValid) {
    return (
      <div>
        <Review />
      </div>
    );
  } else {
    redirect("/");
  }
}
