"use client";

import React from "react";
import Invoice from "../components/Invoice";
import History from "../components/History";
import Summary from "../components/Summary";

export function Dash(props) {
  const API_URL_SUM = "http://localhost:3000/api/invoice/range";
  const API_URL_ALL = "http://localhost:3000/api/all";
  const API_URL = "http://localhost:3000/api";
  const [allInvoices, setInvoices] = React.useState([]);
  const [summary, setSummary] = React.useState({
    invoiceCount: -1,
    dollarTotal: 0,
    start: "",
    end: "",
  });

  /**
   * Gets a weeks worth of invoices and makes useful summed information
   * to send over to the summary component to display.
   */
  async function getSummary() {
    let date = new Date(Date.now());
    let day = date.getDay();
    console.log(day);

    while (day != 6) {
      let tmp = new Date(date.setDate(date.getDate() - 1));
      day = tmp.getDay();
      console.log(day);
      date = tmp;
    }

    let end = new Date(date.setDate(date.getDate() + 1)).toISOString();
    let begin = new Date(date.setDate(date.getDate() - 7)).toISOString();

    try {
      const res = await fetch(API_URL_SUM + `?begin=${begin}&end=${end}`);
      const data = await res.json();
      let total = 0;

      data.forEach((element) => {
        console.log(element);
        total = total + parseFloat(element.price);
      });

      console.log(data.length);

      setSummary({
        invoiceCount: data.length,
        dollarTotal: total,
        start: begin,
        end: end,
      });
    } catch (error) {
      console.error(error);
    }
  }

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
    await getSummary();
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
    getSummary();
  }, []);

  return (
    <div>
      <h2 className="greeting-top">Welcome back!</h2>
      <div>
        <Summary summary={summary} />
        <Invoice reloadInvoices={getData} />
        <h2 className="past-title">Past Invoices</h2>
        <History data={allInvoices} deleteInvoice={deleteInvoice} />
      </div>
    </div>
  );
}
