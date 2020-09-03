import React from "react";
import { faEraser } from "@fortawesome/free-solid-svg-icons";

import { ThemeContext } from "./WhiteBoard";

function Canvas(props) {
  const context = React.useContext(ThemeContext);
  console.log(context);
  console.log(props.tool);
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);
  const [state, setState] = React.useState({
    isDrawing: false,
    elements: [],
    x: 0,
    y: 0,
    isDrawing: false,
    lineWidth : 0
  });

  React.useEffect(() => {
    console.log(props.id);
    console.log(props.tool);
    const canvas = canvasRef.current;
    console.log(canvas);
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    console.log(context);
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 2;
    contextRef.current = context;
    console.log(contextRef.current);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  React.useEffect(() => {
    redrawAll();
  }, [props.data]);

  if (props.tool === "trash") {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  const redrawAll = () => {
    if (state.elements.length === 0) {
      return;
    }
    props.state.elements.forEach((item) => {
      console.log(item);
      if (item.name === "pencil") {
        drawPencil(item.x1, item.x2, item.y1, item.y2);
      }
    });
  };

  if (props.tool === "undo") {
    // undo();
    console.log("undo");
    let array = [...state.elements];
    let new_array = array.splice(array.length - 1, 0);

    setState({ ...state, elements: new_array });
    redrawAll();
  }

  const startDrawing = (event) => {
    console.log(event);

    let rect = canvasRef.current.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    setState({ ...state, x: x, y: y, isDrawing: true });
  };

  const finishDrawing = (event) => {
    if ((canvasRef.current.style.cursor = "crosshair")) {
      canvasRef.current.style.cursor = "auto";
    }
    setState({ ...state, isDrawing: false });
  };

  const drawing = (event) => {
    if (!state.isDrawing) {
      return;
    }
    let rect = canvasRef.current.getBoundingClientRect();
    let x1 = event.clientX - rect.left;
    let y1 = event.clientY - rect.top;
    if (props.tool === "pencil") {
      // props.drawPencil(canvasRef.current,contextRef.current,state.x,state.y,x1,y1)
      drawPencil(state.x, state.y, x1, y1);
      setState({ ...state, x: x1, y: y1 });
    } else if (props.tool === "line") {
      drawLine(state.x, state.y, x1, y1);
    } else if (props.tool === "rectangle") {
      drawRectangle(state.x, state.y, x1, y1);
    } else if (props.tool === "circle") {
      drawCircle(state.x, state.y, x1, y1);
    } else if (props.tool === "ellipse") {
      drawEllipse(x1, y1, state.x, state.y);
    } else if (props.tool === "text") {
    } else if (props.tool === "eraser") {
      eraser(x1, y1);
    }
  };

  const drawPencil = (x1, y1, x2, y2) => {
    console.log(x1, y1);
    contextRef.current.beginPath();

    contextRef.current.moveTo(x1, y1);
    contextRef.current.lineTo(x2, y2);
    contextRef.current.stroke();
    contextRef.current.closePath();
    let w = canvasRef.current.width;
    let h = canvasRef.current.height;

    let data = {
      name: "drawing",
      room: "test",
      data: {
        x1: x1 / w,
        y1: y1 / h,
        x2: x2 / w,
        y2: y2 / h,
      },
    };
    props.handleElements(data);
  };

  const drawLine = (x1, y1, x2, y2) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(x1, y1);
    contextRef.current.lineTo(x2, y2);
    contextRef.current.stroke();
    contextRef.current.closePath();
    let data = {
      name: "line",
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
    };
    setState({ ...state, elements: [...state.elements, data] });
  };

  const drawRectangle = (x1, y1, x2, y2) => {
    contextRef.current.clearRect(x1, y1,x2-x1,y2-y1);
    contextRef.current.beginPath();
    contextRef.current.strokeRect(x1, y1, x2 - x1, y2 - y1);
    contextRef.current.stroke();
    contextRef.current.closePath();
    let data = {
      name: "rectangle",
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
    };
    setState({ ...state, elements: [...state.elements, data] });
  };

  const drawCircle = (x1, y1, x2, y2) => {
    console.log(x1, y1, x2, y2);
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    let x = (x2 + x1) / 2;
    let y = (y2 + y1) / 2;
    let radius = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;
    contextRef.current.beginPath();
    contextRef.current.arc(x, y, radius, 0, Math.PI * 2, false);
    contextRef.current.closePath();
    contextRef.current.stroke();
    let data = {
      name: "circle",
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
    };
    setState({ ...state, elements: [...state.elements, data] });
  };

  const drawEllipse = (x1, y1, x2, y2) => {
    console.log(x1, y1, x2, y2);
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.current.save();
    contextRef.current.beginPath();
    //Dynamic scaling
    let scalex = 1 * ((x1 - x2) / 2);
    let scaley = 1 * ((y1 - y2) / 2);
    contextRef.current.scale(scalex, scaley);
    //Create ellipse
    let centerx = x2 / scalex + 1;
    let centery = y2 / scaley + 1;
    contextRef.current.arc(centerx, centery, 1, 0, 2 * Math.PI);
    contextRef.current.restore();
    contextRef.current.stroke();
    let data = {
      name: "ellipse",
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
    };
    setState({ ...state, elements: [...state.elements, data] });
  };

  const eraser = (x1, y1) => {
    canvasRef.current.style.cursor = "crosshair";
    let radius = 10; // or whatever
    let fillColor = "#ffff";
    contextRef.current.fillStyle = fillColor;
    contextRef.current.beginPath();
    contextRef.current.moveTo(x1, y1);
    contextRef.current.arc(x1, y1, radius, 0, Math.PI * 2, false);
    contextRef.current.fill();
  };

  const undo = () => {};

  return (
    <canvas
      id={props.id}
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={drawing}
      className="shadow"
    />
  );
}
export default Canvas;
