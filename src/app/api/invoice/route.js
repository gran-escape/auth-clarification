import checkSessionCookie from "@/app/actions/cookieChecker";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";

const API_URL = "http://localhost:4000/";

/**
 * This endpoint/ route is setup to call the API to get a single invoice
 * and return all information for it back to the client component.
 * @returns status
 */
export async function GET(request) {
  console.log(`[invoice get] get single invoice called`);
  const id = await request.nextUrl.searchParams.getAll("invoice");
  console.log(parseInt(id[0]));

  // get item data
  const itemRes = await fetch(API_URL + `GetDetails?id=${id}`, {
    next: { revalidate: 0 },
  });
  const itemData = await itemRes.json();

  // get general invoice data
  const genRes = await fetch(API_URL + `GetInvoiceGeneral?id=${id}`, {
    next: { revalidate: 0 },
  });
  const genData = await genRes.json();

  // put it all together and send back
  const returnData = {
    general: genData,
    details: itemData,
  };

  console.log(JSON.stringify(returnData));

  return new Response(JSON.stringify(returnData));
}

export async function PUT(request) {
  const data = await request.json();
  console.log(`[web api put] ${data}`);

  // check if valid cookie
  const isValid = await checkSessionCookie();
  if (!isValid) {
    console.log("invalid");
    return new Response({ status: "error", error: "invalid or no user token" });
  } else {
    // passes the object to update along to the database API
    const header = new Headers();
    header.append("Content-Type", "application/json");

    const req = new Request(API_URL + "Update", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: header,
    });
    await fetch(req);
    return new Response({ status: 200 });
  }
}
