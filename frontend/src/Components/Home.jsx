import React, { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const url = import.meta.env.VITE_APP_URL;

const UNITS = [
  { value: "gram", label: "Gram" },
  { value: "pavan", label: "Pavan" },
];

const CARATS = [
  { value: "24k", label: "24k" },
  { value: "22k", label: "22k" },
  { value: "18k", label: "18k" },
];

const CURRENCIES = [
  { value: "Rs", label: "₹ - Rupee", conversionRate: 1 },
  { value: "USD", label: "$ - Dollar", conversionRate: 83.38 },
];

const calculateGoldPrice = (quantity, unit, carat, price) => {
  const caratOffsets = { "24k": 0, "22k": 443.15, "18k": 886.3 };
  const unitMultiplier = unit === "pavan" ? 8 : 1;
  return quantity * unitMultiplier * (price - caratOffsets[carat]);
};

const getConversionRate = (currency) =>
  CURRENCIES.find((curr) => curr.value === currency)?.conversionRate || 1;

export default function Home() {
  const pdfRef = useRef(null);
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("gram");
  const [carat, setCarat] = useState("24k");
  const [currency, setCurrency] = useState("₹");
  const [totalAmount, setTotalAmount] = useState(0);
  const [pricePerUnit, setPricePerUnit] = useState(0);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("Auth Token");
    if (!isAuthenticated) navigate("/login");
  }, [navigate]);

  const handleCalculate = async () => {
    const res = await fetch(`${url}/gold_rate/ind_gold_rate`);
    const data = await res.json();
    const price = data.price;

    const calculatedAmount = calculateGoldPrice(quantity, unit, carat, price);
    const conversionRate = getConversionRate(currency);
    const convertedAmount = calculatedAmount / conversionRate;

    setTotalAmount(convertedAmount);
    setPricePerUnit(convertedAmount / quantity);
  };

  const handleDownload = () => {
    const content = pdfRef.current;
    const doc = new jsPDF("p", "pt", "a4");

    doc.html(content, {
      callback: (doc) => doc.save("GOLD_data.pdf"),
      x: 0,
      y: -20,
      windowWidth: content.offsetWidth,
      allowTaint: true,
      useCORS: true,
      pagesplit: false,
    });
  };

  return (
    <div style={{ backgroundColor: "var(--main-color-light)", height: "max-content" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1 className="mt-5" style={{ color: "var(--main-color)" }}>Gold Rate Calculator</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="mt-4 grid-container" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, boxSizing: "border-box" }}>
          <TextField
            id="quantity"
            type="number"
            label="Quantity"
            variant="outlined"
            onChange={(e) => setQuantity(e.target.value)}
            sx={textfieldStyles}
          />
          <TextField
            id="unit"
            select
            label="Unit"
            defaultValue="gram"
            SelectProps={{ native: true }}
            helperText="Please select your unit"
            variant="filled"
            onChange={(e) => setUnit(e.target.value)}
            sx={textfieldStyles}
          >
            {UNITS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </TextField>
          <TextField
            id="carat"
            select
            label="Carat"
            defaultValue="24k"
            SelectProps={{ native: true }}
            helperText="Please select your carat"
            variant="filled"
            onChange={(e) => setCarat(e.target.value)}
            sx={textfieldStyles}
          >
            {CARATS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </TextField>
          <TextField
            id="currency"
            select
            label="Currency"
            defaultValue="₹"
            SelectProps={{ native: true }}
            helperText="Please select your currency"
            variant="filled"
            onChange={(e) => setCurrency(e.target.value)}
            sx={textfieldStyles}
          >
            {CURRENCIES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </TextField>
          <Button style={{ backgroundColor: "var(--main-color)", color: "var(--text-color)", fontWeight: "600" }} onClick={handleCalculate} sx={{ marginBottom: 1 }}>
            Calculate
          </Button>
          <p>Total Amount: {totalAmount.toFixed(0)}</p>
        </div>
      </div>
      {totalAmount ? (
        <div className="card mt-5 mb-2 price border-0" style={{ background: "linear-gradient(180deg,#ffb784,#ffc790,#ffd89c,#ffe8a8,#fff9b4)", width: "60%", margin: "0 auto", textAlign: "center" }}>
          <div className="card-body" ref={pdfRef} id="tata">
            <h4 className="text-center mb-4 mt-1 odd" style={{ color: "var(--text-color-dark)" }}>{carat} Gold Price Today</h4>
            <table className="table table-hover text-center odd">
              <thead>
                <tr>
                  <th>{unit === "gram" ? "Gram" : "Pavan"}</th>
                  <th>Gold Rate</th>
                </tr>
              </thead>
              <tbody>
                {[1, 8, 10, 100].map((multiplier) => (
                  <tr key={multiplier}>
                    <td>{multiplier} {unit}</td>
                    <td>{(pricePerUnit * multiplier).toFixed(0)}</td>
                  </tr>
                ))}
                <tr>
                  <td><mark>{quantity} {unit}</mark></td>
                  <td><mark>{totalAmount.toFixed(0)}</mark></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const textfieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderColor: "var(--main-color)",
    ":hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--main-color)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "var(--main-color)",
  },
  "& .MuiOutlinedInput-input": {
    color: "var(--main-color)",
  },
  "& .Mui-focused": {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--main-color)",
      boxShadow: "0 0 0 2px ${var(--main-color)}",
    },
    "& .MuiInputLabel-root": {
      color: "var(--main-color)",
    },
    "& .MuiOutlinedInput-input": {
      color: "var(--text-color-dark)",
    },
  },
  marginBottom: 1,
};
