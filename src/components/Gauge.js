import React from "react";

const getNeedlePosition = value => {
  // Setting gauge limits with assumed min and max temperatures
  // for all time, based on local weather
  const min = 30;
  const max = 105;

  const inc = 11;
  const range = (max - min) / inc;
  for (let i = 0; i <= inc; i++) {
    if (value >= max - range * i) {
      return inc - i;
    }
    continue;
  }
};

export default function Gauge({ value, children }) {
  return (
    <div className="gauge">
      <div className={`needle needle-${getNeedlePosition(value)}`} />
      <div className="gauge-temp-cont" />
      <div className="gauge-temp">{children}</div>
    </div>
  );
}
