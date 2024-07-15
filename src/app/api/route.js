import checkSessionCookie from "../actions/cookieChecker";
const API_URL = process.env.DB_API_URL;

/**
 * function of the Web API that takes in a request from the
 * client containing all data of an invoice to be sent along
 * to the database API for adding.
 *
 * @param {request} request
 * @returns status (good or bad)
 */
export async function POST(request) {
  // check if valid cookie
  const isValid = await checkSessionCookie();
  if (!isValid) {
    console.log("invalid");
    return new Response(
      JSON.stringify({ status: "error", error: "invalid or no user token" })
    );
  }

  const req = await request.json();
  const { location, invoiceNotes, date, total } = req.invoice.invoiceInfo;
  const { rows } = req.details;

  console.log(rows);

  rows.forEach((row) => {
    const { name, cost, quantity, notes, taxTotal, tax } = row;
    console.log(`${name}\n${cost}\n${quantity}\n${notes}\n${taxTotal}\n${tax}`);
  });

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const apiReq = new Request(API_URL + "addinvoice", {
    headers: headers,
    body: JSON.stringify(req),
    method: "POST",
  });

  try {
    const apiRes = await fetch(apiReq);
    console.log("Completed!!!" + apiRes);
    return new Response(JSON.stringify({ complete: true }));
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ complete: false }));
  }
}

export async function GET() {
  console.log("[web] web api GET has been called");
  if (!checkSessionCookie()) {
    return new Response({ status: false });
  }

  try {
    const request = new Request(API_URL + "GetInvoicesFromDate", {
      method: "GET",
    });
    const res = await fetch(request);
    const data = await res.json();
    console.log(data);
    return new Response(JSON.stringify(data));
  } catch (error) {
    console.log(
      `[web] web api error returned status ${res.status} attempting to get invoices from api`
    );
    console.error(error);
    return new Response({ status: res.status });
  }
}

/**
 * delete endpoint for web API.
 * @param {request} request
 * @returns status
 */
export async function DELETE(request) {
  // use Next JS to grab parameter passed in url (id)
  const id = await request.nextUrl.searchParams.getAll("id");

  try {
    const request = new Request(API_URL + `DeleteInvoice?id=${id}`);
    await fetch(request, {
      method: "DELETE",
    });
    return new Response(JSON.stringify({ status: 200 }));
  } catch (error) {
    console.error("[error] dealing with request between web api and db api");
    return new Response(JSON.stringify({ status: 500 }));
  }
}
