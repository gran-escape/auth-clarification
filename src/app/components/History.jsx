"use client";

import { redirect } from "next/navigation";
import React from "react";

export default function History(props) {
  const invoices = props.data;

  async function deleteClicked(event) {
    console.log(event.target.id);
    props.deleteInvoice(event.target.id);
  }

  console.log(
    `[history] ${invoices.length} invoices appearing in History client component`
  );
  return (
    <div className="past-container">
      {invoices.length > -1 ? null : <p>Loading Invoices...</p>}
      {invoices.map((item, index) => {
        return (
          <div key={index} className="past-inv-card">
            <p> Invoice Number- {item.id} </p>
            <p> Location- {item.location}</p>
            <p>
              Date- {new Date(item.date_created).toISOString().substring(0, 10)}
            </p>
            <p>Total ${item.price}</p>
            <div>
              <button
                className="del-button table-button"
                onClick={deleteClicked}
                id={item.id}
              >
                Delete
              </button>
              <a href={`/review?invoice=${item.id}`}>
                <button className="add-button table-button" id={item.id}>
                  Print
                </button>
              </a>
              <a href={`edit?invoice=${item.id}`}>
                <button className="update-button table-button">Edit</button>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
