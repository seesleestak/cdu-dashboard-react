import React from "react";
import { Row, Col } from "react-flexbox-grid";
import Container from "@hixme-ui/container";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import "./App.css";

function Dash() {
  return <span className="dash">&mdash;</span>;
}

function MenuItem({ name }) {
  return (
    <Link to={name} className="item">
      {name}
    </Link>
  );
}

class Time extends React.Component {
  state = {
    time: moment().format("h:mm:ss A"),
    date: moment().format("dddd, MMMM Do YYYY")
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        time: moment().format("h:mm:ss A"),
        date: moment().format("dddd, MMMM Do YYYY")
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div>
        <Container noPadding margin="20px 20px 5px 20px">
          {this.state.date}
        </Container>
        <Container noPadding margin="0 20px 20px 20px">
          {this.state.time}
        </Container>
      </div>
    );
  }
}

function Index() {
  return (
    <div>
      <Container className="hd">Index</Container>
      <Time />
      <Container>
        <Row start="xs" between="sm">
          <Col xs={6} className="left-col">
            <Dash />
            <MenuItem name="todo" />
          </Col>
          <Col xs={6} className="right-col">
            <MenuItem name="weather" />
            <Dash />
          </Col>
        </Row>
        <Row start="xs" between="sm">
          <Col xs={6} className="left-col">
            <Dash />
            <MenuItem name="calendar" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function Todo() {
  return <Container className="hd">Todo</Container>;
}

function Frame({ children }) {
  return (
    <Row center="xs">
      <Col xs={12} sm={10} md={8} lg={6}>
        <div className="frame">{children}</div>
      </Col>
    </Row>
  );
}

function Calendar() {
  return <Container className="hd">Calendar</Container>;
}

class Weather extends React.Component {
  state = {
    data: {
      forecast: {},
      current: {}
    },
    loading: false
  };

  componentDidMount() {
    this.setState({
      loading: true
    });

    const { REACT_APP_OPEN_WEATHER_KEY } = process.env;
    if (REACT_APP_OPEN_WEATHER_KEY) {
      const callRes = Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?zip=91367,us&APPID=${REACT_APP_OPEN_WEATHER_KEY}&units=imperial`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?zip=91367,us&APPID=${REACT_APP_OPEN_WEATHER_KEY}&units=imperial`
        )
      ]).then(res => {
        this.setState({
          data: {
            forecast: res[0].data,
            current: res[1].data
          },
          loading: false
        });
      });
    }
  }

  render() {
    const { loading, data } = this.state;
    const { current, forecast } = data;

    return (
      <div>
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
                </div>
              </div>
            )}
            {current.main && (
              <div>
                <Container className="temp" padding="20px 20px 0 20px">
                  {Math.round(current.main.temp)} &deg;F
                </Container>
                <div className="weather-item">current</div>
                <Container>
                  <Row center="xs">
                    <Col xs={12} sm={3} style={{ marginBottom: "10px" }}>
                      {Math.round(current.main.temp_min)} &deg;F
                      <div className="weather-item">lo</div>
                    </Col>
                    <Col xs={12} sm={3}>
                      {Math.round(current.main.temp_max)} &deg;F
                      <div className="weather-item">hi</div>
                    </Col>
                  </Row>
                </Container>
              </div>
            )}
            {/*
                  <Container noPadding margin="20px 0">
                    <Row>
                    {data.list &&
                        data.city &&
                        data.list.map(item => {
                          return (
                            <Col xs={12} sm={4} md={3} key={item.dt}>
                            <div className="weather-item">
                                {moment(item.dt, "x").format("h:mm A")}
                            </div>
                            </Col>
                          );
                        })}
                          </Row>
                        </Container>
                        */}
          </div>
        )}
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Router>
        <Frame>
          <Route path="/" exact component={Index} />
          <Route path="/todo" exact component={Todo} />
          <Route path="/weather" exact component={Weather} />
          <Route path="/calendar" exact component={Calendar} />
        </Frame>
      </Router>
    </div>
  );
}

export default App;
