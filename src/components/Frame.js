import React from "react";
import { Row, Col } from "react-flexbox-grid";

export default function Frame({ children }) {
  return (
    <Row center="xs" style={{ margin: 0 }}>
      <Col xs={12} sm={11} md={9} lg={8} xl={6}>
        <div className="frame">{children}</div>
      </Col>
    </Row>
  );
}
