"use client";

import React from "react";
import Invoice from "../components/Invoice";
import Sidebar from "../components/Sidebar";
import History from "../components/History";

export function Dash(props) {
  const API_URL_ALL = "http://localhost:3000/api/all";
  const API_URL = "http://localhost:3000/api";
  const [allInvoices, setInvoices] = React.useState([]);

  /**
   * function to get all regular invoice data for the past
   * invoices field. Might need to cut this down at some point.
   */
  async function getData() {
    const response = await fetch(API_URL_ALL, {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);
    setInvoices(data);
  }

  /**
   * given an id, function will find that invoice, remove it from
   * the database, reload the invoices and reset the state of
   * allInvoices. Function passed as a prop to past invoices.
   * @param {int} id
   */
  async function deleteInvoice(id) {
    console.log(`[delete] delete invoice called for invoice ${id}`);
    const request = new Request(API_URL + `?id=${id}`, {
      method: "DELETE",
    });

    try {
      const response = await fetch(request);
      const data = await response.json();
      console.log(`Complete! Returned ${data}`);
      getData();
    } catch (error) {
      console.log(error);
    }
  }

  // used to get old invoices initially on load
  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h2 className="greeting-top">Welcome back!</h2>
      <div>
        <Invoice reloadInvoices={getData} />
        <h2 className="past-title">Past Invoices</h2>
        <History data={allInvoices} deleteInvoice={deleteInvoice} />
      </div>
    </div>
  );
}
