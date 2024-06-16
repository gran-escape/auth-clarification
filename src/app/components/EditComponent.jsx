"use client";

import React, { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import EditInvoice from "./EditInvoice";
import { goHomePage } from "../actions/actions";

export default function EditComponent(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoiceGeneral, setInvoiceGeneral] = useState();
  const [invoiceDetails, setInvoiceDetials] = useState();
  const API_URL = "http://localhost:3000/api/invoice";

  /**
   * function to be called by child function when button is
   * clicked. will send JSON to server api endpoint to deal
   * with.
   *
   * @param {JSON} data
   */
  async function complete() {
    //TODO: implement
    try {
      const request = new Request(API_URL, {
        method: "PATCH",
        body: JSON.stringify({
          general: invoiceGeneral,
          details: invoiceDetails,
        }),
      });

      await fetch(request);
    } catch (error) {
      console.log(error);
    }
  }

  function updateDetails(data) {
    setInvoiceDetials(data);
  }

  function updateGeneral(data) {
    setInvoiceGeneral(data);
  }

  /**
   * takes the detail data sent over from the
   * server and deconstructs it into a JSON
   * object for use in a React state.
   *
   * @param {JSON} detailData
   * @returns JSON data
   */
  function deconstructDetailData(detailData) {
    let detailArr = [];
    detailData.forEach((detail) => {
      // deconstruct for better variable names
      const {
        id: id,
        item_name: name,
        item_notes: notes,
        item_price: cost,
        item_qty: quantity,
      } = detail;
      detailArr.push({
        id,
        name,
        notes,
        cost,
        quantity,
        total: (quantity * cost).toFixed(2),
      });
    });
    return detailArr;
  }

  function deconstructGeneralData(invoiceData) {
    // deconstruct the general invoice info
    const {
      id,
      price,
      location,
      date_created: date,
      invoice_notes: invoiceNotes,
    } = invoiceData;

    return {
      id: id,
      price: price,
      location: location,
      date: new Date(date).toISOString().substring(0, 10),
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
    return (
      <div>
        <h1>Hello!</h1>
        <EditInvoice
          updateDetails={updateDetails}
          updateGeneral={updateGeneral}
          general={invoiceGeneral}
          details={invoiceDetails}
          complete={complete}
        />
      </div>
    );
  }

  /**
   * useEffect called as an init function to grab the invoice
   * from the database and get it ready to display.
   */
  useEffect(() => {
    getInvoiceData();
  }, []);

  return invoiceGeneral ? (
    <div>{showInvoice()}</div>
  ) : (
    <h2>Loading Invoice {searchParams[1]}...</h2>
  );
}
