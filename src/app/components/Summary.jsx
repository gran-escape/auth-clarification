"use client";

import React from "react";

export default function Summary(props) {
  console.log(props);
  return (
    <div>
      <h2>Summary of past week </h2>
      <div>
        {props.summary.invoiceCount > 0 ? <p>Yay</p> : <p>Loading...</p>}
      </div>
    </div>
  );
}
