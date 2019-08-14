import React from "react";
import { Row, Col } from "react-flexbox-grid";
import Container from "@hixme-ui/container";

import Page from "components/Page";
import Time from "components/Time";
import Dash from "components/Dash";
import MenuItem from "components/MenuItem";

export default function Index() {
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
      </Container>
    </Page>
  );
}
