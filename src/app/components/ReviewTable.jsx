import React from "react";

export default function ReviewTable(props) {
  console.log(props.rows);
  const rows = props.rows;
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th className="review-header">#</th>
            <th className="review-header">Item</th>
            <th className="review-header">Cost</th>
            <th className="review-header">Qty</th>
            <th className="review-header">Notes</th>
            <th className="review-header">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            // deconstruct data passed through. It still has names from database
            const {
              item_name: name,
              item_price: price,
              item_qty: quantity,
              item_notes: notes,
            } = row;
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{name}</td>
                <td>{price}</td>
                <td>{quantity}</td>
                <td>{notes}</td>
                <td>${(quantity * price).toFixed(2)}</td>
              </tr>
            );
          })}
          <tr className="col-total">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>${props.info.price}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
