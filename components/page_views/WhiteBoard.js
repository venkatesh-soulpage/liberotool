import React from "react";
import { Tools, Canvas } from "components/page_views";
import { Button, Row, Tab, Tabs, Col, Nav, Dropdown, FormControl, Form } from "react-bootstrap";
import { Socket } from "phoenix-socket";

export const ThemeContext = React.createContext(null);

function WhiteBoard(props) {
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);
  const [state, setState] = React.useState({
    boards: [{ name: "board-1" }],
    isDrawing: false,
    tool: "pencil",
    active: "board-1",
    elements: [],
    data: null,
    lineWidth: 0,
  });
  let channel;
  let room;

  React.useEffect(() => {
    let socket = new Socket("wss://sphxchat.herokuapp.com/socket", {
      params: { token: window.userToken },
    });
    socket.connect();
    room = window.location.pathname.replace(/^\/|\/$/g, "").split("/")[1] || "test";
    channel = socket.channel("room:" + room, {});
    console.log(channel);
    channel.join().receive("ok", (resp) => {
      console.log("Joined successfully", resp);
    }); // join the channel
    channel.on("drawing", (data) => {
      console.log(data);
      setState({ ...state, data: data });
    });
  }, []);

  const handleTool = (tool) => {
    console.log(tool);
    setState({ ...state, tool: tool });
  };

  const handleLinewidth = (width) => {
    console.log(width);
    setState({ ...state, lineWidth: width });
  };

  const handleElements = (data) => {
    let array = [];
    array.push(data);

    // channel.push(data);
    setState({ ...state, elements: array });
  };

  return (
    <div className="main-div">
      <div className="container">
        <Row>
          <Col md="2"></Col>
          <Col md="8">
            <Tools handleTool={handleTool} handleLinewidth={handleLinewidth} />
          </Col>
          <Col md="2"></Col>
        </Row>
      </div>

      <Button
        className="add-board ml-2"
        onClick={() =>
          setState({
            ...state,
            boards: [...state.boards, { name: `board-${state.boards.length + 1}` }],
            active: `board-${state.boards.length + 1}`,
          })
        }
      >
        +
      </Button>
      <Tabs
        activeKey={state.active}
        onSelect={(k) => setState({ ...state, active: k })}
        className="board-tab border-0"
      >
        <Button
          onClick={() =>
            setState({
              ...state,
              boards: [...state.boards, { name: `board-${state.boards.length + 1}` }],
              active: `board-${state.boards.length + 1}`,
            })
          }
        >
          Add Board
        </Button>

        {state.boards.map((item, index) => (
          <Tab eventKey={item.name} title={item.name} key={index}>
            <Canvas id={item.name} tool={state.tool} handleElements={handleElements} />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}

export default WhiteBoard;
