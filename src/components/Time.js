import React from 'react'
import moment from 'moment'

import Container from '@hixme-ui/container'

export default class Time extends React.Component {
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
