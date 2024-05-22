import { Login } from "./ui/login-form";
import checkSessionCookie from "./actions/cookieChecker";
import { redirect } from "next/navigation";
import { Dash } from "./ui/dashboard";

const API_URL = "http://localhost:3000/api/all";

export default async function Home() {
  const isValid = await checkSessionCookie();
  if (!isValid) {
    return (
      <div>
        <Login />
      </div>
    );
  } else {
    redirect("/dashboard");
  }
}
