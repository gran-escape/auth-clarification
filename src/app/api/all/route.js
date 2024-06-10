import { revalidatePath } from "next/cache";
import checkSessionCookie from "@/app/actions/cookieChecker";

/**
 * works for now, will have to limit later.
 */
export async function GET() {
  // added basic check for now.
  if (!checkSessionCookie()) {
    return new Response({ status: false });
  }

  console.log("[dev_all] get all invoices called");
  revalidatePath("http://localhost:4000/GetAllInvoiceGeneral/");
  try {
    const request = new Request("http://localhost:4000/GetAllInvoiceGeneral/");
    const res = await fetch(request);
    const data = await res.json();
    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error("[error] error getting all invoices from api");
  }
}
