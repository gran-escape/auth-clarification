"use client";
import React, { useState } from "react";
import Table from "./Table";

export default function Invoice(props) {
  // calculate the current date
  let tmpDate = new Date();
  tmpDate.setMinutes(tmpDate.getMinutes() - tmpDate.getTimezoneOffset());
  let date = tmpDate.toISOString().substring(0, 10);

  // state for managing invoice general info
  const [invoiceInfo, setInfo] = useState({
    location: "",
    total: 0,
    date: date,
    invoiceNotes: "",
  });
  // state to manage rows
  const [rows, setRows] = useState([]);

  /**
   * Package everything up and send it over to the web api.
   * This uses a JSON object to package details in the body
   */
  async function sendToServer() {
    const url = "http://localhost:3000/api";
    // sets the structure of what will be sent
    const body = {
      invoice: {
        invoiceInfo,
      },
      details: {
        rows,
      },
    };

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const request = new Request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    try {
      const res = await fetch(request);
      console.log(res.json());
    } catch (error) {
      console.error(`[error] trouble with request and web server api ` + error);
    }
  }

  function generalInfoChange(event) {
    // TODO: maybe fix the need for this at some point...
    if (event) {
      console.log("we have info!");
      const { id, value } = event.target;
      setInfo((prevVal) => {
        return { ...prevVal, [id]: value };
      });
    } else {
      console.log("likely auto re-render, ignore this");
    }
  }

  /**
   * function sent over to the Table component. Function adds
   * a row that is created in the table to the invoice rows state.
   * @param {rows} data
   */
  function addRow(data) {
    setRows((prevVal) => {
      return [...prevVal, data];
    });
  }

  /**
   * function called by a row within the table component that
   * needs to be removed. use filter to create new array and
   * update state to new row list.
   * @param {row} id
   */
  function delRow(id) {
    const tempArr = rows.filter((row, index) => index != id);
    setRows(tempArr);
  }

  // recalculates total when row is added
  React.useEffect(() => {
    console.log("retotal");
    let total = 0;
    rows.forEach((row) => (total += parseFloat(row.total)));
    setInfo((prevVal) => {
      return { ...prevVal, total: total };
    });
  }, [rows]);

  /**
   * when done selected, send info to server funcation called
   * any fields are reset to empty/ defaults.
   */
  async function complete() {
    if (
      invoiceInfo.date.length > 0 &&
      invoiceInfo.location.length > 1 &&
      rows.length > 0
    ) {
      await sendToServer();

      // reset fields
      setRows([]);
      setInfo({
        location: "",
        total: 0,
        date: date,
        invoiceNotes: "",
      });
      // poke parent component to reload!
      props.reloadInvoices();
    } else {
      alert(
        "Please make sure a valid location and date are entered. There may also be no commited rows."
      );
    }
  }

  return (
    <div className="gen-container">
      <h2>Create Invoice</h2>
      {/* TODO: use more components here later on! */}
      <div className="top-container">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          name="location"
          id="location"
          placeholder="Location"
          onChange={generalInfoChange}
          value={invoiceInfo.location}
        />
        <label htmlFor="invoiceNotes">Notes</label>
        <input
          type="text"
          name="invoiceNotes"
          id="invoiceNotes"
          placeholder="Add Notes Here"
          onChange={generalInfoChange}
          value={invoiceInfo.invoiceNotes}
        />
        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          defaultValue={date}
          onChange={generalInfoChange}
        />
      </div>
      <Table
        rows={rows}
        addRow={addRow}
        delRow={delRow}
        invoiceTotal={invoiceInfo.total}
      />
      <button
        className="table-button add-button done-button"
        onClick={complete}
      >
        Done!
      </button>
    </div>
  );
}
