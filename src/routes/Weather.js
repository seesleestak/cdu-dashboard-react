import React from "react";
import { Row, Col } from "react-flexbox-grid";
import Container from "@hixme-ui/container";
import moment from "moment";
import axios from "axios";
import groupBy from "lodash/groupBy";

import Gauge from 'components/Gauge'
import Page from 'components/Page'
import Temp from 'components/Temp'
import Timeline from 'components/Timeline'

export default class Weather extends React.Component {
  state = {
    data: {
      forecast: {},
      current: {}
    },
    loading: false
  };

  getWeather() {
    this.setState({
      loading: true
    });

    const { REACT_APP_OPEN_WEATHER_KEY } = process.env;
    if (REACT_APP_OPEN_WEATHER_KEY) {
      Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?zip=91367,us&APPID=${REACT_APP_OPEN_WEATHER_KEY}&units=imperial`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?zip=91367,us&APPID=${REACT_APP_OPEN_WEATHER_KEY}&units=imperial`
        )
      ]).then(res => {
        const forecast = res[0].data;
        const convertedList = forecast.list.map(time => {
          return {
            ...time,
            dt_converted_date: moment.unix(time.dt).format("YYYY-MM-DD"),
            dt_converted_txt: moment.unix(time.dt).format()
          };
        });
        const groupedList = groupBy(convertedList, "dt_converted_date");

        this.setState({
          data: {
            forecast: { ...forecast, list: convertedList, groupedList },
            current: res[1].data
          },
          loading: false
        });
      });
    }
  }

  componentDidMount() {
    // Refresh weather info every 10 min
    this.timer = setInterval(this.getWeather(), 600000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { loading, data } = this.state;
    const { current, forecast } = data;

    return (
      <Page>
        <Container className="hd">Weather</Container>
        {loading ? (
          <div>...</div>
        ) : (
          <div>
            {Object.keys(current).length > 0 && (
              <div>
                {current.name} ({current.sys.country})
                <div className="weather-item">
                  <div>lat: {current.coord.lat}</div>
                  <div>lon: {current.coord.lon}</div>
                  <div>unit: &deg;F</div>
                </div>
              </div>
            )}
            {current.main && (
              <div>
                <Container>
                  <Row around="xs">
                    <Col xs={3} style={{ paddingBottom: "10px" }}>
                      <Gauge value={current.main.temp}>
                        <Temp size={22} value={current.main.temp} />
                        <div className="weather-item uppercase">curr</div>
                      </Gauge>
                    </Col>
                    <Col xs={3} style={{ paddingBottom: "10px" }}>
                      <Gauge value={current.main.temp_max}>
                        <Temp size={22} value={current.main.temp_max} />
                        <div className="weather-item uppercase">hi</div>
                      </Gauge>
                    </Col>
                    <Col xs={3}>
                      <Gauge value={current.main.temp_min}>
                        <Temp size={22} value={current.main.temp_min} />
                        <div className="weather-item uppercase">lo</div>
                      </Gauge>
                    </Col>
                  </Row>
                </Container>
              </div>
            )}
            <div className="weather-list-cont">
              {forecast.groupedList &&
                Object.keys(forecast.groupedList).map((date, dateIndex) => {
                  return (
                    <Row
                      start="xs"
                      key={date}
                      style={{ marginTop: dateIndex === 0 ? "0" : "14px" }}
                    >
                      <Col xs={12}>
                        <span className="weather-hd">
                          {moment(date).format("dddd")}
                        </span>
                      </Col>
                      <Col xs={12}>
                        <Timeline timeArr={forecast.groupedList[date]} />
                      </Col>
                    </Row>
                  );
                })}
            </div>
          </div>
        )}
      </Page>
    );
  }
}
