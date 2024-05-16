import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Padding } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_APP_URL;

const UNIT = [
  {
    value: "gram",
    label: "gram",
  },
  {
    value: "pavan",
    label: "pavan",
  },
];

const CARRAT = [
  {
    value: "24k",
    label: "24k",
  },
  {
    value: "22k",
    label: "22k",
  },
  {
    value: "18k",
    label: "18k",
  },
];

const currencies = [
  {
    value: "Rs",
    label: "₹ - Rupee",
    conversionRate: 1, // Conversion rate to INR (Indian Rupee)
  },
  {
    value: "USD",
    label: "$ - Dollar",
    conversionRate: 83.38, // Conversion rate to INR (Indian Rupee)
  },
];

export default function Home() {
  const pdfRef = useRef(null);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("gram");
  const [carrat, setCarrat] = useState("24k");
  const [currency, setCurrency] = useState("₹");
  const [totalAmount, setTotalAmount] = useState(0);

  const handleCalculate = async () => {
    const res = await fetch(`${url}/gold_rate/ind_gold_rate`, {
      method: "GET",
    });
    const data = await res.json();
    const price = data.price;

    let calculatedAmount = 0;
    if (unit === "gram") {
      if (carrat === "24k") {
        calculatedAmount = quantity * price;
      } else if (carrat === "22k") {
        calculatedAmount = quantity * (price - 443.15);
      } else if (carrat === "18k") {
        calculatedAmount = quantity * (price - 886.3);
      }
    } else if (unit === "pavan") {
      if (carrat === "24k") {
        calculatedAmount = quantity * 8 * price;
      } else if (carrat === "22k") {
        calculatedAmount = quantity * 8 * (price - 443.15);
      } else if (carrat === "18k") {
        calculatedAmount = quantity * 8 * (price - 886.3);
      }
    }

    const conversionRate =
      currencies.find((curr) => curr.value === currency)?.conversionRate || 1;
    const convertedAmount = calculatedAmount / conversionRate;

    setTotalAmount(convertedAmount);
  };

  //Data Html to PDF converter part
  const handleDownload = () => {
    const content = pdfRef.current; // This is the correct reference to the DOM element
    console.log("content:", content);

    const doc = new jsPDF("p", "pt", "a4");

    // Ensure that you pass 'content' directly, not 'content.current'
    doc.html(content, {
      callback: function (doc) {
        doc.save("GOLD_data.pdf");
      },
      x: 0,
      y: -20,
      windowWidth: content.offsetWidth,
      allowTaint: true,
      useCORS: true,
      pagesplit: false,
    });

    // const doc = new jsPDF({
    //   orientation: "p",
    //   unit: "pt",
    //   format: "a4",
    // });

    // // The 'html' method will try to fit the content into the specified width and scale accordingly
    // doc.html(content, {
    //   callback: function (doc) {
    //     doc.save("Gold_data.pdf");
    //   },
    //   x: 10,
    //   y: 10,
    // });
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("Auth Token");

    if (!isAuthenticated) navigate("/login");
  }, []);

  return (
    <div
      style={{
        backgroundColor: "var(--main-color-light)",
        height: "max-content",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1 className="mt-5 " style={{ color: "var(--main-color)" }}>
          Gold Rate Calculator
        </h1>
      </div>
      {/* Feild */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="mt-4 grid-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)", // 2 columns, equal width
            gap: 16,
            boxSizing: "border-box",
          }}
        >
          <TextField
            id="outlined-basic"
            type="number"
            label="Quantity"
            variant="outlined"
            onChange={(e) => setQuantity(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderColor: "var(--main-color)", // border color
                ":hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "var(--main-color)", // hover border color
                  },
              },
              "& .MuiInputLabel-root": {
                color: "var(--main-color)", // label color
              },
              "& .MuiOutlinedInput-input": {
                color: "var(--main-color)", // input text color
              },
              "& .Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--main-color)", // focused border color
                  boxShadow: "0 0 0 2px ${var(--main-color)}", // add a custom focus color
                },
                "& .MuiInputLabel-root": {
                  color: "var(--main-color)", // change label color on focus
                },
                "& .MuiOutlinedInput-input": {
                  color: "var(--text-color-dark)", // change input text color on focus
                },
              },
              marginBottom: 1,
            }}
          />
          <TextField
            id="filled-select-unit-native"
            select
            label="Unit"
            defaultValue="gram"
            SelectProps={{
              native: true,
            }}
            helperText="Please select your unit"
            variant="filled"
            sx={{
              "& .MuiFilledInput-root": {
                borderColor: "var(--main-color)", // border color
                ":hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error) .MuiFilledInput-underline:before":
                  {
                    borderColor: "var(--main-color)", // hover border color
                  },
              },
              "& .MuiInputLabel-root": {
                color: "var(--main-color)", // label color
              },
              "& .MuiFilledInput-input": {
                color: "var(--text-color-dark)", // input text color
              },
              "& .MuiFilledInput-underline:before": {
                borderBottomColor: "var(--main-color)", // underline color
              },
              "& .MuiFormHelperText-root": {
                color: "var(--text-color-dark)", // helper text color
              },
              marginBottom: 1, // add 16px margin to the bottom
            }}
            onChange={(e) => setUnit(e.target.value)}
          >
            {UNIT.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <TextField
            id="filled-select-carrat-native"
            select
            label="Carat"
            defaultValue="24k"
            SelectProps={{
              native: true,
            }}
            helperText="Please select your carat"
            variant="filled"
            onChange={(e) => setCarrat(e.target.value)}
            sx={{
              "& .MuiFilledInput-root": {
                borderColor: "var(--main-color)", // border color
                ":hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error) .MuiFilledInput-underline:before":
                  {
                    borderColor: "var(--main-color)", // hover border color
                  },
              },
              "& .MuiInputLabel-root": {
                color: "var(--main-color)", // label color
              },
              "& .MuiFilledInput-input": {
                color: "var(--text-color-dark)", // input text color
              },
              "& .MuiFilledInput-underline:before": {
                borderBottomColor: "var(--main-color)", // underline color
              },
              "& .MuiFormHelperText-root": {
                color: "var(--text-color-dark)", // helper text color
              },
              marginBottom: 1, // add 16px margin to the bottom
            }}
          >
            {CARRAT.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <TextField
            id="filled-select-currency-native"
            select
            label="Currency"
            defaultValue="₹"
            SelectProps={{
              native: true,
            }}
            helperText="Please select your currency"
            variant="filled"
            onChange={(e) => setCurrency(e.target.value)}
            sx={{
              "& .MuiFilledInput-root": {
                borderColor: "var(--main-color)", // border color
                ":hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error) .MuiFilledInput-underline:before":
                  {
                    borderColor: "var(--main-color)", // hover border color
                  },
              },
              "& .MuiInputLabel-root": {
                color: "var(--main-color)", // label color
              },
              "& .MuiFilledInput-input": {
                color: "var(--text-color-dark)", // input text color
              },
              "& .MuiFilledInput-underline:before": {
                borderBottomColor: "var(--main-color)", // underline color
              },
              "& .MuiFormHelperText-root": {
                color: "var(--text-color-dark)", // helper text color
              },
              marginBottom: 1, // add 16px margin to the bottom
            }}
          >
            {currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          <Button
            style={{
              backgroundColor: "var(--main-color)",
              color: "var(--text-color)",
              fontWeight: "600",
            }}
            onClick={handleCalculate}
            sx={{
              marginBottom: 1, // add 16px margin to the bottom
            }}
          >
            Calculate
          </Button>
          <p>Total Amount: {totalAmount.toFixed(0)}</p>
        </div>
      </div>
      {/* Table */}
      <div
        className="card mt-5 mb-2 price border-0"
        style={{
          background:
            "linear-gradient(180deg,#ffb784,#ffc790,#ffd89c,#ffe8a8,#fff9b4)",
          width: "60%",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {totalAmount ? (
          <div className="card-body" ref={pdfRef} id="tata">
            <h4
              className="text-center mb-4 mt-1 odd"
              style={{ color: "var(--text-color-dark)" }}
            >
              {carrat} Gold Price Today
            </h4>
            {unit === "gram" ? (
              <table className="table table-hover text-center odd">
                <thead>
                  <tr>
                    <th>Gram</th>
                    <th>Gold Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1 Gram</td>
                    <td>{totalAmount.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td>8 Gram</td>
                    <td>{totalAmount.toFixed(0) * 8}</td>
                  </tr>
                  <tr>
                    <td>10 Gram</td>
                    <td>{totalAmount.toFixed(0) * 10}</td>
                  </tr>
                  <tr>
                    <td>100 Gram</td>
                    <td>{totalAmount.toFixed(0) * 100}</td>
                  </tr>
                  <tr>
                    <td>
                      <mark>{quantity} Gram</mark>
                    </td>
                    <td>
                      <mark>{totalAmount.toFixed(0) * quantity}</mark>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : unit === "pavan" ? (
              <table className="table table-hover text-center odd">
                <thead>
                  <tr>
                    <th>Pavan</th>
                    <th>Gold Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1 Pavan</td>
                    <td>{totalAmount.toFixed(0)}</td>
                  </tr>
                  <tr>
                    <td>8 Pavan</td>
                    <td>{totalAmount.toFixed(0) * 8}</td>
                  </tr>
                  <tr>
                    <td>10 Pavan</td>
                    <td>{totalAmount.toFixed(0) * 10}</td>
                  </tr>
                  <tr>
                    <td>100 Pavan</td>
                    <td>{totalAmount.toFixed(0) * 100}</td>
                  </tr>
                  <tr>
                    <td>
                      <mark>{quantity} Pavan</mark>
                    </td>
                    <td>
                      <mark>{totalAmount.toFixed(0) * quantity}</mark>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : null}
          </div>
        ) : null}
        {/* {totalAmount ? (
          <div className="card-footer text-end text-white price">
            <button
              type="button"
              className="btn btn-warning btn-floating"
              onClick={handleDownload}
            >
              <i
                className="fas fa-download"
                style={{ color: "var(--text-color-dark)" }}
              ></i>
            </button>
          </div>
        ) : null} */}
      </div>
    </div>
  );
}
