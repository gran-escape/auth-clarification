"use client";

import React from "react";

export default function Summary(props) {
  function displaySummary() {
    console.log(props);
    return (
      <div className="summary-container">
        <div className="summary-element">
          <div>
            <h2>Invoices</h2>
            <p>{props.summary.invoiceCount}</p>
          </div>
        </div>
        <div className="summary-element">
          <div>
            <h2>Money</h2>
            <p>${props.summary.dollarTotal}</p>
          </div>
        </div>
        <div className="summary-element">
          <div>
            <h2>Avg. $</h2>
            <p>
              ${props.summary.dollarTotal / props.summary.invoiceCount} average
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Summary of past week </h2>
      <div>
        {props.summary.invoiceCount > 0 ? (
          displaySummary()
        ) : (
          <p>No invoices found yet!</p>
        )}
      </div>
    </div>
  );
}
