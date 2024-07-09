import checkSessionCookie from "@/app/actions/cookieChecker";

const DB_API_URL = process.env.DB_API_URL;
/**
 *
 * @param {request} request
 * @returns JSON object of invoices within date range
 */
export async function GET(request) {
  const isValid = await checkSessionCookie();
  if (isValid) {
    const beginDate = request.nextUrl.searchParams.getAll("begin");
    const endDate = request.nextUrl.searchParams.getAll("end");

    try {
      const res = await fetch(
        DB_API_URL + "InvoicesDateRange" + `?begin=${beginDate}&end=${endDate}`
      );
      const data = await res.json();
      console.log(data);
      return new Response(JSON.stringify(data));
    } catch (error) {
      console.error(
        `[web api] error transmitting request to db server ` + error
      );
    }
  } else {
    return new Response(JSON.stringify({ complete: false }));
  }
}
