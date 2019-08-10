import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "react-flexbox-grid";
import Container from "@hixme-ui/container";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import groupBy from "lodash/groupBy";

import "./App.css";

function Dash() {
  return <span className="dash">&mdash;</span>;
}

function Page({ children, ...rest }) {
  return (
    <div className="pg" {...rest}>
      {children}
    </div>
  );
}

function Temp({ value, size }) {
  const rounded = Math.round(value);

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
    <span className={getTempClass(rounded)} style={{ fontSize: `${size}px` }}>
      {rounded}
      <span style={{ fontSize: `${size - 6}px` }}>&deg;F</span>
    </span>
  );
}
Temp.propTypes = {
  size: PropTypes.number
};
Temp.defaultProps = {
  size: 18
};

function Timeline({ timeArr }) {
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

function MenuItem({ name }) {
  return (
    <Link to={name} className="uppercase">
      {name}
    </Link>
  );
}

class Time extends React.Component {
  state = {
    time: moment().format("h:mm:ss A"),
    date: moment().format("ddd, MMM D YYYY")
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        time: moment().format("h:mm:ss A"),
        date: moment().format("ddd, MMM D YYYY")
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="uppercase">
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
    <Page>
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
    </Page>
  );
}

class Todo extends React.Component {
  state = {
    list: [],
    text: ""
  };

  addTodo = e => {
    e.preventDefault();
    const addText = this.state.text.toUpperCase();
    if (addText) {
      this.setState({
        list: [
          ...this.state.list,
          {
            complete: false,
            content: addText
          }
        ],
        text: ""
      });
    }
  };

  toggleTodo = index => {
    const { list } = this.state;
    this.setState({
      list: [
        ...list.slice(0, index),
        {
          ...list[index],
          complete: !list[index].complete
        },
        ...list.slice(index + 1)
      ]
    });
  };

  removeTodo = index => {
    const { list } = this.state;
    this.setState({
      list: [...list.slice(0, index), ...list.slice(index + 1)]
    });
  };

  handleInput = e => {
    this.setState({
      text: e.target.value
    });
  };

  componentDidMount() {
    this.todoInput.focus();
  }

  render() {
    const { list, text } = this.state;
    return (
      <Page>
        <Container className="hd">Todo</Container>
        <div className="todo-list">
          <Row start="xs">
            <Col xs={12}>
              {list.map((item, index) => {
                return (
                  <div key={index}>
                    <span onClick={() => this.toggleTodo(index)}>
                      <Dash />
                      <span className={`${item.complete ? "complete" : ""}`}>
                        {item.content}
                      </span>
                    </span>
                    <span
                      className="red uppercase"
                      style={{ marginLeft: "20px", fontSize: "12px" }}
                      onClick={() => this.removeTodo(index)}
                    >
                      (delete)
                    </span>
                  </div>
                );
              })}
            </Col>
          </Row>
        </div>
        <Row between="xs">
          <Col xs={6}>
            <form onSubmit={this.addTodo}>
              <input
                className="todo-input"
                value={text}
                ref={i => (this.todoInput = i)}
                onChange={this.handleInput}
              />
            </form>
          </Col>
          <Col xs={6}>
            {text && (
              <div
                className="uppercase"
                onClick={this.addTodo}
                style={{ textAlign: "left" }}
              >
                + Add
              </div>
            )}
          </Col>
        </Row>
      </Page>
    );
  }
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
  return (
    <Page>
      <Container className="hd">Calendar</Container>
    </Page>
  );
}

class Weather extends React.Component {
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
                </div>
              </div>
            )}
            {current.main && (
              <div>
                <Container padding="20px 20px 0 20px">
                  <Temp size={22} value={current.main.temp} />
                </Container>
                <div className="weather-item uppercase">current</div>
                <Container>
                  <Row center="xs">
                    <Col xs={3} style={{ paddingBottom: "10px" }}>
                      <Temp size={18} value={current.main.temp_min} />
                      <div className="weather-item uppercase">lo</div>
                    </Col>
                    <Col xs={3}>
                      <Temp size={18} value={current.main.temp_max} />
                      <div className="weather-item uppercase">hi</div>
                    </Col>
                  </Row>
                </Container>
              </div>
            )}
            <Container
              noPadding
              margin="0 0 20px"
              style={{ overflowY: "auto" }}
            >
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
            </Container>
          </div>
        )}
      </Page>
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
