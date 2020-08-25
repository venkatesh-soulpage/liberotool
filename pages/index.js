import Head from "next/head";
import MainLayout from "layouts/MainLayout";
import { Button, Row, Tab, Tabs, Col, Nav, Dropdown, FormControl, Form } from "react-bootstrap";
//fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import $ from "jquery";
import { Socket } from "phoenix-socket";

import {
  ToolEvents,
  handleLine,
  changeColor,
  fontSize,
  changebgColor,
  socketConnection,
  addMouse,
  onCanvasTransfer,
  onDrawingEvent,
  onDrawRect,
  backgroundColor,
  onDrawLines,
  onDrawCircle,
  onDrawEllipse,
  onTextDraw
} from "./canvas.js";

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
];

export default function Home() {
  const [state, setState] = React.useState({
    boards: 1,
    active: "board-1",
    activeTool: "pencil",
    line_width: 0,
  });

  const [dropShow, setDropShow] = React.useState(false);
  console.log(state);
  var canvaso;
  var contexto;
  var canvas;
  var context;
  var textarea;
  var channel;
  
  React.useEffect(() => {
    console.log("effect");
    handleCanvas();
   fetchData();
  }, [state]);

  React.useEffect(() => {
    handleCanvas();
    fetchData();
  }, []);

  function fetchData(){
    channel=  socketConnection(state);
    if(channel!=undefined){
   channel.on("mousemove", addMouse);
   channel.on("copyCanvas", onCanvasTransfer);
    channel.on('drawing', onDrawingEvent);
   channel.on('rectangle', onDrawRect);
   channel.on("background_color", backgroundColor);
     channel.on('linedraw', onDrawLines);
   channel.on('circledraw', onDrawCircle);
    channel.on('ellipsedraw', onDrawEllipse);
    channel.on('textdraw', onTextDraw);
    }
  }
 
  function handleCanvas(){
    canvaso = document.getElementById(state.active);
    contexto = canvaso.getContext("2d");
    canvas = document.getElementById(`temp-${state.active}`);
    context = canvas.getContext("2d");
    // textarea=document.getElementById("text_tool");
    if (canvaso.width < window.innerWidth) {
      canvaso.width = window.innerWidth - 100;
    }

    if (canvaso.height < window.innerHeight) {
      canvaso.height = window.innerHeight - 200;
    }
    canvas.width = canvaso.width;
    canvas.height = canvaso.height;
  }

  function handleClick(item) {
    item === "more" ? setDropShow(!dropShow) : ToolEvents[item](canvaso, contexto, canvas, context);
  }

  function handleLineWidth(e) {
    console.log(e.target.value);
    handleLine(e.target.value);
  }

  function handleColor(e) {
    console.log(e.target.value);
    changeColor(e.target.value);
  }

  function handleFontSize(e) {
    fontSize(e.target.value);
  }

  function handlebgColor(e) {
    changebgColor(e.target.value);
  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {/* Render custom icon here */}
      {children}
    </a>
  ));

  const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
          <Form.Group>
            <Form.Label>Thickness</Form.Label>
            <FormControl autoFocus type="number" onChange={(e) => handleLineWidth(e)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>FontSize</Form.Label>
            <Form.Control type="number" onChange={(e) => handleFontSize(e)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <FormControl
              type="color"
              name=""
              placeholder="Color"
           
              id="colour-picker"
              onChange={(e) => handleColor(e)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Background</Form.Label>
            <FormControl
              type="color"
              name=""
              placeholder="Color"
         
              id="colour-picker"
              onChange={(e) => handlebgColor(e)}
            />
          </Form.Group>
        </div>
      );
    }
  );

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
              <div
                className="text-center tool-item buttons"
                key={index}
                id={item}
                onClick={() => handleClick(item)}
              >
                <img src={image_path} className={"img-fluid " + item} alt="" />
                <span className="d-block mt-2">{item}</span>
              </div>
            );
          })}

         
          <Dropdown>
            <Dropdown.Toggle as={CustomToggle}>
              <FontAwesomeIcon icon={faEllipsisV} className="ml-2" />
              <span className="d-block mt-2">more</span>
            </Dropdown.Toggle>

            <Dropdown.Menu as={CustomMenu} className="custom-menu">
             
            </Dropdown.Menu>
          </Dropdown>

        
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
                <canvas id={board} className="temp"></canvas>

                <canvas id={"temp-" + board} className="tempBoard"></canvas>
              </Tab>
            );
          })(x, i)
        )}
      </Tabs>
    </div>
  );
}
