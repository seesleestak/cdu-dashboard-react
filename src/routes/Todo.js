import React from "react";
import { Row, Col } from "react-flexbox-grid";
import Container from "@hixme-ui/container";

import Page from "components/Page";
import Dash from "components/Dash";

export default class Todo extends React.Component {
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
