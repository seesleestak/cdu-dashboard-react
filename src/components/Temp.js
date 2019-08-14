import React from "react";
import PropTypes from "prop-types";

export default function Temp({ value, size }) {
  const formatted = value.toFixed(1);
  const num = formatted.split(".");

  function getTempClass(value) {
    if (value >= 90) {
      return "red";
    } else if (value >= 80) {
      return "yellow";
    } else if (value >= 68) {
      return "green";
    } else if (value >= 45) {
      return "blue";
    }
    return "";
  }

  return (
    <span className={getTempClass(formatted)} style={{ fontSize: `${size}px` }}>
      {num[0]}
      <span style={{ fontSize: `${size - 6}px` }}>
        <span style={{ margin: "0 2px" }}>.</span>
        {num[1]}
      </span>
    </span>
  );
}
Temp.propTypes = {
  size: PropTypes.number
};
Temp.defaultProps = {
  size: 18
};
