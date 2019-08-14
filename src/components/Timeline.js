import React from "react";
import moment from "moment";

import Temp from "components/Temp";

export default function Timeline({ timeArr }) {
  return (
    <div style={{ padding: "28px 10px" }}>
      <div className="tl-container" style={{ height: "unset" }}>
        {timeArr.map(time => {
          return <Temp size={16} value={time.main.temp} key={time.dt} />;
        })}
      </div>
      <div className="tl-container">
        <span className="tl" />
        {timeArr.map(time => {
          return <span className="tl-pnt" key={time.dt} />;
        })}
      </div>
      <div className="tl-container" style={{ height: "unset" }}>
        {timeArr.map(time => {
          return (
            <span className="weather-item" key={time.dt}>
              {moment(time.dt_converted_txt).format("h A")}
            </span>
          );
        })}
      </div>
    </div>
  );
}
