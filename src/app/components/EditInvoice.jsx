"use client";
import React, { useState } from "react";
import Table from "./Table";

export default function EditInvoice(props) {
  const [invoiceInfo, setInfo] = useState(props.general);
  const [rows, setRows] = useState(props.details);

  //console.log(props.details);

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
      return { ...prevVal, price: total };
    });
    console.log(`New total is ${total}`);
  }, [rows]);

  /**
   * when done selected, send info to server funcation called
   * any fields are reset to empty/ defaults.
   */
  function complete() {
    props.complete(rows);
  }

  return (
    <div className="gen-container">
      <h2>Edit Invoice</h2>
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
          defaultValue={invoiceInfo.date}
          onChange={generalInfoChange}
        />
      </div>
      <Table
        rows={rows}
        addRow={addRow}
        delRow={delRow}
        invoiceTotal={invoiceInfo.price}
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
