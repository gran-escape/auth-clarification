"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Review() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoice, setInvoice] = useState();
  const API_URL = "http://localhost:3000/api/invoice";

  async function getInvoiceData() {
    const INVOICE_URL = API_URL + "?invoice=" + searchParams[1];
    const response = await fetch(INVOICE_URL);
    const data = await response.json();
    console.log(data.general[0]);

    // TODO: parse and destructure JSON and place into state

    setInvoice({ id: 3 });
  }

  // used to initialize everything and grab data
  useEffect(() => {
    getInvoiceData();
  }, []);

  return <div>{invoice ? <h2>Invoice</h2> : <h2>Loading...</h2>}</div>;
}
