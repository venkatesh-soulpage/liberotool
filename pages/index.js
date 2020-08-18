import Head from "next/head";
import MainLayout from "layouts/MainLayout";
import { Button, Row, Tab, Tabs, Col, Nav } from "react-bootstrap";

import $ from "jquery";

import { ToolEvents } from "./canvas.js";

var TOOLS = [
  "pencil",
  "eraser",
  "line",
  "rectangle",
  "circle",
  "ellipse",
  "text",
  "trash",
  "undo",
  "redo",
  "more",
];

export default function Home() {
  const [state, setState] = React.useState({
    boards: 1,
    active: "board-1",
    activeTool: "pencil",
  });
  const [dropShow, setDropShow] = React.useState(false);
  console.log(state);

  function handleClick(item) {
    item === "more" ? setDropShow(!dropShow) : ToolEvents[item]();
  }

  return (
    <div className="container-fluid h-100">
      <Head>
        <title>Whiteboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout logo="icons/boards_logo.svg" />
      <div className="card mx-auto mt-2 position-absolute cstm-toolbar">
        <div className="card-body d-flex justify-content-around p-2 bg-light">
          {TOOLS.map((item, index) => {
            var image_path = `icons/${item}.svg`;
            return (
              <div className="text-center tool-item " key={index} onClick={() => handleClick(item)}>
                <img src={image_path} className={"img-fluid " + item} alt="" />
                <span className="d-block mt-2">{item}</span>
              </div>
            );
          })}

          {dropShow ? (
            <div className="dropdown-menu d-block bg-light" style={{ right: "0", left: "unset" }}>
              <div className="form-group">
                <select className="form-control" name="size" id="">
                  <option>2</option>
                  <option>4</option>
                  <option>6</option>
                </select>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <Button
        onClick={() =>
          setState({
            ...state,
            boards: state.boards + 1,
            active: `board-${state.boards + 1}`,
          })
        }
      >
        Add Board
      </Button>
      <Tabs
        activeKey={state.active}
        onSelect={(k) => setState({ ...state, active: k })}
        className="mt-5"
      >
        {[...Array(state.boards)].map((x, i) =>
          (function () {
            var board = `board-${i + 1}`;

            return (
              <Tab eventKey={board} title={board} key={i} className="h-100 w-100">
                <canvas id={board} className="h-100 w-100"></canvas>
                <canvas id={"temp-" + board} className="h-100 w-100 tempBoard"></canvas>
              </Tab>
            );
          })(x, i)
        )}
      </Tabs>
    </div>
  );
}
