"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReviewTable from "./ReviewTable";

export default function Review() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoice, setInvoice] = useState();
  const API_URL = "http://localhost:3000/api/invoice";

  function foo() {
    const { general, details } = invoice;

    // deconstruct the general invoice info
    const {
      id,
      price,
      location,
      date_created: dateCreated,
      invoice_notes: invoiceNotes,
    } = general;

    // debug for me
    console.log(
      `id ${id}\nprice ${price}\nlocation ${location}\ncreate date ${dateCreated}\nnotes ${invoiceNotes}`
    );

    return (
      <div>
        <div>
          <h2>Invoice id - {id}</h2>
          <h3>Details for invoice {id}</h3>
          <p>Total - ${price}</p>
          <p>{location}</p>
          {invoiceNotes ? <p>{invoiceNotes}</p> : <p>No notes found</p>}
          <p>
            Invoice created on{" "}
            {new Date(dateCreated).toISOString().substring(0, 10)}
            {/* TODO use cleaner format */}
          </p>
        </div>
        <div>
          <ReviewTable rows={details} info={general} />
        </div>
        <div>
          <a href="/">
            <button type="button">Back</button>
          </a>
        </div>
      </div>
    );
  }

  async function getInvoiceData() {
    const INVOICE_URL = API_URL + "?invoice=" + searchParams[1];
    const response = await fetch(INVOICE_URL);
    const data = await response.json();

    // set new state with loaded values
    setInvoice({
      general: data.general[0],
      details: data.details,
    });
  }

  // used to initialize everything and grab data
  useEffect(() => {
    getInvoiceData();
  }, []);

  return <div>{invoice ? foo() : <h2>Loading...</h2>}</div>;
}
