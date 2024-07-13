"use client";

import React from "react";

export default function Table(props) {
  const rows = props.rows;
  const taxRate = 0.05; //TODO: make variable!!
  let invoiceTotal = 0;

  // default row state / init
  const [rowState, setRow] = React.useState({
    name: "",
    cost: 1.0,
    quantity: 1,
    notes: "",
    total: 1,
    taxAmount: 0,
    tax: false,
  });

  /**
   * function called to make sure that the row being added
   * has all required fields and won't cause any funny business
   * with either the web api or database. (ideally)
   */
  function validateRowInput() {
    const { name, cost, quantity } = rowState;
    let isValid = false;

    if (name.length > 0 && cost > 0 && quantity > 0) {
      isValid = true;
    } else {
      isValid = false;
    }

    return isValid;
  }

  /**
   * takes the event, grabts target button id and passes
   * that to the parent Invoice component for deletion.
   * @param {event} event
   */
  function deleteRow(event) {
    console.log(event.target.id);
    props.delRow(event.target.id);
  }

  /**
   * runs when the add button is clicked. takes the current state
   * of the row and the values and passes it onto the parent Invoice
   * function (props.addRow)
   */
  function addRow() {
    const isValid = validateRowInput();

    if (isValid) {
      props.addRow(rowState);

      // reset the state of the inputs
      setRow({
        name: "",
        cost: 1.0,
        quantity: 1,
        notes: "",
        taxTotal: 0,
        total: 1,
        tax: false,
      });
    } else {
      alert(
        "One or more required fields of the row is missing. Please make sure all fields are filled."
      );
    }
  }

  /**
   * takes in the value of the current item and returns the tax amount
   * @param {total} value
   * @returns total with tax added
   */
  function addTax(value) {
    const noTaxVal = parseFloat(value);
    const calculatedTax = parseFloat(noTaxVal) * taxRate;
    console.log(`[debug] tax amount: ${calculatedTax}`);
    return calculatedTax.toFixed(2); // TODO: is this sufficient rounding for taxes?
  }

  /**
   * on change listenter for each cell of the table. finds the
   * target id and value and modifies the state of the row
   * accordingly.
   * @param {event} event
   */
  function rowChange(event) {
    // deconstruct id and value
    const { id, value, checked } = event.target;
    let total = parseFloat(rowState.total);

    // if qty is changed, calculate new total
    if (id == "quantity") {
      total = value * rowState.cost;
      total = total.toFixed(2);
      // check for tax
      if (rowState.tax) {
        total = rowState.taxAmount + total;
      }
    }

    // if cost is changed, calculate new total
    if (id == "cost") {
      total = value * rowState.quantity;
      console.log(total);
      total = total.toFixed(2);

      // check for tax
      if (rowState.tax) {
        total = parseFloat(rowState.taxAmount) + total;
      }
    }

    // deal with the checkbox
    if (id == "tax") {
      setRow((prevVal) => {
        return { ...prevVal, tax: checked };
      });
      // if checkbox selected, calculate tax, otherwise, just set to cost * qty
      if (checked) {
        console.log("tax was checked");
        setRow((prevVal) => {
          return {
            ...prevVal,
            total: parseFloat(rowState.total) + addTax(total),
          };
        });
      } else {
        total = rowState.cost * rowState.quantity;
        setRow((prevVal) => {
          return { ...prevVal, total: total };
        });
      }
      console.log(rowState);
    } else {
      // update row state
      console.log("updating row");
      setRow((prevVal) => {
        return { ...prevVal, [id]: value, total: total };
      });
    }
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Cost</th>
            <th>Qty</th>
            <th>Notes</th>
            <th>Tax?</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <input
                className="invoiceInput"
                type="text"
                id="name"
                placeholder="Item"
                onChange={rowChange}
                value={rowState.name}
              />
            </td>
            <td>
              $
              <input
                className="invoiceInput"
                onChange={rowChange}
                type="number"
                id="cost"
                value={rowState.cost}
              />
            </td>
            <td>
              <input
                className="invoiceInput"
                onChange={rowChange}
                type="number"
                id="quantity"
                value={rowState.quantity}
              />
            </td>
            <td>
              <input
                className="invoiceInput"
                onChange={rowChange}
                type="text"
                id="notes"
                value={rowState.notes}
                placeholder="Add Notes"
              />
            </td>
            <td className="invoiceInput">
              <input
                type="checkbox"
                name="tax"
                id="tax"
                checked={rowState.tax}
                onChange={rowChange}
              />
            </td>
            <td className="row-total">${rowState.total}</td>
            <td>
              <button
                type="button"
                className="table-button add-button"
                onClick={addRow}
              >
                Add
              </button>
            </td>
          </tr>
          {rows.map((row, index) => {
            return (
              <tr key={index}>
                <td></td>
                <td>{row.name}</td>
                <td>{row.cost}</td>
                <td>{row.quantity}</td>
                <td>{row.notes}</td>
                <td>
                  <input type="checkbox" checked={row.tax} disabled />
                </td>
                <td className="row-total">{row.total}</td>
                <td>
                  <button
                    name={index + "checkbox"}
                    id={index}
                    type="button"
                    className="table-button del-button"
                    onClick={deleteRow}
                  >
                    Del
                  </button>
                </td>
              </tr>
            );
          })}
          <tr className="col-total">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td className="row-total">${props.invoiceTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
