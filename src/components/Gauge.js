import React from "react";

const getNeedlePosition = value => {
  // Gauge limits with estimated min and max temperatures
  // for all time, based on local weather
  const min = 30;
  const max = 115;

  // Degree position min and max
  const gaugeMax = 170;
  const gaugeMin = -90;

  // Linear interpolation with the value
  return ((value - min) * (gaugeMax - gaugeMin)) / (max - min) + gaugeMin;
};

export default function Gauge({ value, children }) {
  return (
    <div className="gauge">
      <div
        style={{ transform: `rotate(${getNeedlePosition(value)}deg)` }}
        className="needle"
      />
      <div className="gauge-temp-cont" />
      <div className="gauge-temp">{children}</div>
    </div>
  );
}
