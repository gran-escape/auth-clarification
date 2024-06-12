"use client";

import React, { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";

export default function EditComponent(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoiceGeneral, setInvoiceGeneral] = useState();
  const [invoiceDetails, setInvoiceDetials] = useState();
  const API_URL = "http://localhost:3000/api/invoice";

  function deconstructDetailData(detailData) {
    let detailArr = [];
    detailData.forEach((detail) => {
      // deconstruct for better variable names
      const {
        id: id,
        item_name: itemName,
        item_notes: notes,
        item_price: itemPrice,
        item_qty: quantity,
      } = detail;
      detailArr.push({ id, itemName, notes, itemPrice, quantity });
    });
    return detailArr;
  }

  function deconstructGeneralData(invoiceData) {
    // deconstruct the general invoice info
    const {
      id,
      price,
      location,
      date_created: dateCreated,
      invoice_notes: invoiceNotes,
    } = invoiceData;

    return {
      id: id,
      price: price,
      location: location,
      dateCreated: dateCreated,
      invoiceNotes: invoiceNotes,
    };
  }

  /**
   * function that is called when the page is first rendered. will need to grab
   * the data from the database, prep it, and get it ready to be used in the state.
   */
  async function getInvoiceData() {
    const INVOICE_URL = API_URL + `?invoice=${searchParams[1]}`;
    console.log(`Searching ${INVOICE_URL} to call database.`);

    try {
      const request = new Request(INVOICE_URL, {
        method: "GET",
      });
      const res = await fetch(request);
      const data = await res.json();

      // take general data and deconstruct/ unpack into new react state
      const generalData = deconstructGeneralData(data.general[0]);
      setInvoiceGeneral(generalData);

      // now work with the individual items on the invoice
      const detailData = deconstructDetailData(data.details);
      setInvoiceDetials(detailData);
    } catch (error) {
      console.error(error);
      redirect("/");
    }
  }

  /**
   * function to display the invoice edit page
   */
  function showInvoice() {
    // TODO: implement
    console.log(invoiceDetails);
    return <h1>Hello!</h1>;
  }

  /**
   * useEffect called as an init function to grab the invoice
   * from the database and get it ready to display.
   */
  useEffect(() => {
    getInvoiceData();
  }, []);

  return invoiceGeneral ? (
    showInvoice()
  ) : (
    <h2>Loading Invoice {searchParams[1]}...</h2>
  );
}
