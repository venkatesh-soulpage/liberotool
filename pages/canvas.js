import $ from "jquery";
import { Socket } from "phoenix-socket";
import { func } from "prop-types";
var colorPicked = "#35384D";
var lineWidthPicked = 2;
var SelectedFontSize;
var canvaso;
var contexto;
var canvas;
var context;
var tool;
var textarea;
var socket;
var room;
var channel;
var user_id;
var state;



export function socketConnection(st){
  state=st;
  socket = new Socket("wss://sphxchat.herokuapp.com/socket", {
    params: { token: window.userToken },
  });
  socket.connect();
  room = window.location.pathname.replace(/^\/|\/$/g, "").split("/")[1] || "test";
    channel = socket.channel("room:" + room, {});
    channel.join().receive("ok", (resp) => {
    console.log("Joined successfully", resp);
  }); // join the channe
   user_id =
    window.location.pathname.replace(/^\/|\/$/g, "").split("/")[2] ||
    `user${Math.floor(Math.random() * 100)}`;
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

    return channel;
}

export function handleLine(width) {
  console.log(width);
  lineWidthPicked = width;
}

export function changeColor(color) {
  console.log(color);
  colorPicked = color;
}

export function fontSize(size) {
  SelectedFontSize = size;
}

export function changebgColor(color) {
  $(".temp").css("background-color", color);
  channel.push("background_color", {
    room: room,
    name: "background_color",
    data: {
      color: $("#colour-picker").val(),
      board :  state.active
    },
  });
}

export const ToolEvents = {
 pencil: function (cso, ctxo, cs, ctx) {
    canvaso = cso;
    contexto = ctxo;
    canvas = cs;
    context = ctx;
    
   // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener("mousedown", ev_canvas, false);
    // canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener("mousemove", throttle(ev_canvas, 10), false);
    canvas.addEventListener("mouseup", ev_canvas, false);
    $("#rectangle").removeClass("bg-white");
    $("#circle").removeClass("bg-white");
    $("#ellipse").removeClass("bg-white");
    $("#line").removeClass("bg-white");
    $("#text").removeClass("bg-white");
    $("#trash").removeClass("bg-white");
    $("#pencil").addClass("bg-white");
     tool = this;
    this.started = false;
     this.mousedown = function (ev) {
     tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };
   // This function is called every time you move the mouse. Obviously, it only
    // draws if the tool.started state is set to true (when you are holding down
    // the mouse button).
    this.mousemove = function (ev) {
      if (tool.started) {
        drawPencil(tool.x0, tool.y0, ev._x, ev._y, colorPicked, lineWidthPicked,state, true,canvas);
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      }
    };
   // This is called when you release the mouse button.
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
  },

  rectangle: function (cso, ctxo, cs, ctx) {
    canvaso = cso;
    contexto = ctxo;
    canvas = cs;
    context = ctx;
    $("#pencil").removeClass("bg-white");
    $("#circle").removeClass("bg-white");
    $("#ellipse").removeClass("bg-white");
    $("#line").removeClass("bg-white");
    $("#text").removeClass("bg-white");
    $("#trash").removeClass("bg-white");
    $("#rectangle").addClass("bg-white");
    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener("mousedown", ev_canvas, false);
    // canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener("mousemove", throttle(ev_canvas, 10), false);
    canvas.addEventListener("mouseup", ev_canvas, false);
    tool = this;
    this.started = false;
    this.mousedown = function (ev) {
      console.log(ev);
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };
    this.mousemove = function (ev) {
      console.log(ev._x,tool.x0);
      if (!tool.started) {
        return;
      }
      var pos_x = Math.min(ev._x, tool.x0);
      console.log(pos_x);
      var pos_y = Math.min(ev._y, tool.y0);
      var pos_w = Math.abs(ev._x - tool.x0);
      var pos_h = Math.abs(ev._y - tool.y0);
      context.clearRect(0, 0, canvas.width, canvas.height); //in drawRect
     if (!pos_w || !pos_h) {
        return;
      }
      //console.log("emitting")
      drawRect(pos_x, pos_y, pos_w, pos_h, colorPicked, lineWidthPicked, true,state);
      //context.strokeRect(x, y, w, h); // in drawRect
    };
   this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
  },

  circle: function (cso, ctxo, cs, ctx) {
    canvaso = cso;
    contexto = ctxo;
    canvas = cs;
    context = ctx;
    $("#pencil").removeClass("bg-white");
    $("#rectangle").removeClass("bg-white");
    $("#ellipse").removeClass("bg-white");
    $("#line").removeClass("bg-white");
    $("#text").removeClass("bg-white");
    $("#trash").removeClass("bg-white");
    $("#circle").addClass("bg-white");
     // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener("mousedown", ev_canvas, false);
    // canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener("mousemove", throttle(ev_canvas, 10), false);
    canvas.addEventListener("mouseup", ev_canvas, false);
    tool = this;
    this.started = false;
   this.mousedown = function (ev) {
      tool.started = true;
      var rect = canvas.getBoundingClientRect();
      tool.x1 = ev.clientX - rect.left;
      tool.y1 = ev.clientY - rect.top;
    };
    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
      var rect = canvas.getBoundingClientRect();
      tool.x2 = ev.clientX - rect.left;
      tool.y2 = ev.clientY - rect.top;
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawCircle(tool.x1, tool.y1, tool.x2, tool.y2, colorPicked, lineWidthPicked,state, true);
     };
this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
  },

  ellipse: function (cso, ctxo, cs, ctx) {
    canvaso = cso;
    contexto = ctxo;
    canvas = cs;
    context = ctx;
    $("#pencil").removeClass("bg-white");
    $("#rectangle").removeClass("bg-white");
    $("#circle").removeClass("bg-white");
    $("#line").removeClass("bg-white");
    $("#text").removeClass("bg-white");
    $("#trash").removeClass("bg-white");
    $("#ellipse").addClass("bg-white");
    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener("mousedown", ev_canvas, false);
    // canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener("mousemove", throttle(ev_canvas, 10), false);
    canvas.addEventListener("mouseup", ev_canvas, false);
     tool = this;
    this.started = false;
    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };
    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
    var x = Math.min(ev._x, tool.x0);
    var y = Math.min(ev._y, tool.y0);
    var w = Math.abs(ev._x - tool.x0);
    var h = Math.abs(ev._y - tool.y0);
    context.clearRect(0, 0, canvas.width, canvas.height);
      drawEllipse(x, y, w, h, colorPicked, lineWidthPicked,state, true);
    };
   this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
  },
  line: function (cso, ctxo, cs, ctx) {
    canvaso = cso;
    contexto = ctxo;
    canvas = cs;
    context = ctx;
    $("#pencil").removeClass("bg-white");
    $("#rectangle").removeClass("bg-white");
    $("#circle").removeClass("bg-white");
    $("#ellipse").removeClass("bg-white");
    $("#text").removeClass("bg-white");
    $("#trash").removeClass("bg-white");
    $("#line").addClass("bg-white");
   // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener("mousedown", ev_canvas, false);
    // canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener("mousemove", throttle(ev_canvas, 10), false);
    canvas.addEventListener("mouseup", ev_canvas, false);
    tool = this;
    this.started = false;
   this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };
   this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
      drawLines(tool.x0, tool.y0, ev._x, ev._y, colorPicked, lineWidthPicked,state, true);
    };
    this.mouseup = function (ev) {
      if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
        img_update(true);
      }
    };
  },
  text: function (cso, ctxo, cs, ctx) {
    canvaso = cso;
    contexto = ctxo;
    canvas = cs;
    context = ctx;
    $("#pencil").removeClass("bg-white");
    $("#rectangle").removeClass("bg-white");
    $("#circle").removeClass("bg-white");
    $("#ellipse").removeClass("bg-white");
    $("#line").removeClass("bg-white");
    $("#trash").removeClass("bg-white");
    $("#text").addClass("bg-white");
    // Attach the mousedown, mousemove and mouseup event listeners.
    canvas.addEventListener("mousedown", ev_canvas, false);
    // canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener("mousemove", throttle(ev_canvas, 10), false);
    canvas.addEventListener("mouseup", ev_canvas, false);
    var container = canvaso.parentNode;
    //Text Tool start
    textarea = document.createElement("textarea");
    textarea.id = "text_tool";
    textarea.focus();
    textarea.className += " form-control";
    container.appendChild(textarea);
   // Text tool's text container for calculating
    // lines/chars
    var tmp_txt_ctn = document.createElement("div");
    tmp_txt_ctn.style.display = "none";
    container.appendChild(tmp_txt_ctn);
    tool = this;
    this.started = false;
    textarea.style.display = "none";
    textarea.style.value = "";
    this.mousedown = function (ev) {
      tool.started = true;
      tool.x0 = ev._x;
      tool.y0 = ev._y;
    };
    this.mousemove = function (ev) {
      if (!tool.started) {
        return;
      }
      var x = Math.min(ev._x, tool.x0);
      var y = Math.min(ev._y, tool.y0);
      var width = Math.abs(ev._x - tool.x0);
      var height = Math.abs(ev._y - tool.y0);
      textarea.style.left = x  + 'px';
      textarea.style.top = y + 'px';
      textarea.style.width = width + "px";
      textarea.style.height = height + "px";
      textarea.style.display = "block";
      textarea.style.color = colorPicked;
      textarea.style.font = SelectedFontSize + "px";
    };
    this.mouseup = function (ev) {
      if (tool.started) {
        var lines = textarea.value.split("\n");
        var processed_lines = [];
     for (var i = 0; i < lines.length; i++) {
          var chars = lines[i].length;
        for (var j = 0; j < chars; j++) {
            var text_node = document.createTextNode(lines[i][j]);
            tmp_txt_ctn.appendChild(text_node);

            // Since tmp_txt_ctn is not taking any space
            // in layout due to display: none, we gotta
            // make it take some space, while keeping it
            // hidden/invisible and then get dimensions
            tmp_txt_ctn.style.position = "absolute";
            tmp_txt_ctn.style.visibility = "hidden";
            tmp_txt_ctn.style.display = "block";
            var width = tmp_txt_ctn.offsetWidth;
            var height = tmp_txt_ctn.offsetHeight;
            tmp_txt_ctn.style.position = "";
            tmp_txt_ctn.style.visibility = "";
            tmp_txt_ctn.style.display = "none";
            // Logix
           if (width > parseInt(textarea.style.width)) {
              break;
            }
          }
         processed_lines.push(tmp_txt_ctn.textContent);
          tmp_txt_ctn.innerHTML = "";
        }
        var fs = SelectedFontSize + "px";
        DrawText(SelectedFontSize + "px", colorPicked, textarea.style.left, textarea.style.top, processed_lines,state, true);
        console.log("lines saved");
        textarea.style.display = "none";
        textarea.value = "";
        tool.mousemove(ev);
        tool.started = false;
      }
    };
  },
  trash: function (cso, ctxo, cs, ctx) {
    canvaso = cso;
    contexto = ctxo;
    canvas = cs;
    context = ctx;
    $("#pencil").removeClass("bg-white");
    $("#rectangle").removeClass("bg-white");
    $("#circle").removeClass("bg-white");
    $("#ellipse").removeClass("bg-white");
    $("#line").removeClass("bg-white");
    $("#text").removeClass("bg-white");
    $("#trash").addClass("bg-white");
    context.clearRect(0, 0, canvas.width, canvas.height);
    contexto.clearRect(0, 0, canvaso.width, canvaso.height);
    clearAll_update(true, canvas, canvaso,state);
  },
  };

function ev_canvas(ev) {
  console.log(ev);
  var CanvPos = canvas.getBoundingClientRect(); //Global Fix cursor position bug
  if (ev.clientX || ev.clientX == 0) {
   ev._x = ev.clientX - CanvPos.left;
   ev._y = ev.clientY - CanvPos.top;
     } 
  // Call the event handler of the tool.
  var func = tool[ev.type];
  if (func) {
    console.log("evtype");
    func(ev);
  }
  //Hide textbox if not equals to text tool
}

// limit the number of events per second
function throttle(callback, delay) {
  var previousCall = new Date().getTime();
  return function () {
    var time = new Date().getTime();
   if (time - previousCall >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}

function img_update(trans){
  contexto.drawImage(canvas, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
 if (!trans) {
    return;
  }
  channel.push("copyCanvas", {
    name: "copyCanvas",
    data: {
      transferCanvas: true,
      board : state.active
    },
    room: room,
  });
}

//draw rectangle
function drawRect(min_x, min_y, abs_x, abs_y, color, linewidth, emit,state) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (color) context.strokeStyle = color;
  else context.strokeStyle = colorPicked;
  if (linewidth) context.lineWidth = linewidth;
  else context.lineWidth = lineWidthPicked;
  context.strokeRect(min_x, min_y, abs_x, abs_y);

  if (!emit) {
    return;
  }
  var w = canvaso.width;
  var h = canvaso.height;

  channel.push('rectangle', {
    room: room,
    name:"rectangle",
    data:{
    min_x: min_x / w,
    min_y: min_y / h,
    abs_x: abs_x / w,
    abs_y: abs_y / h,
    color: colorPicked,
    lineThickness: lineWidthPicked,
    board : state.active
    }
  });
}

//draw circle
function drawCircle(x1, y1, x2, y2, color, linewidth,state, emit) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var x = (x2 + x1) / 2;
  var y = (y2 + y1) / 2;
  var radius = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / 2;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.closePath();
  if (color) context.strokeStyle = color;
  else context.strokeStyle = colorPicked;
  if (linewidth) context.lineWidth = linewidth;
  else context.lineWidth = lineWidthPicked;
  context.stroke();

  if (!emit) {
    return;
  }
  var w = canvaso.width;
  var h = canvaso.height;
   channel.push("circledraw", {
    room: room,
    name: "circledraw",
    data: {
      x1: x1 / w,
      y1: y1 / h,
      x2: x2 / w,
      y2: y2 / h,
      color: colorPicked,
      lineThickness: lineWidthPicked,
      board : state.active
    },
  });
}

//draw pencil
function drawPencil(x0, y0, x1, y1, color, linewidth,state, emit,canvas) {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
 if (color) {
    console.log(color);
    context.strokeStyle = color;
  } else {
    context.strokeStyle = colorPicked;
  }
  if (linewidth) {
    context.lineWidth = linewidth;
  } else {
    context.lineWidth = lineWidthPicked;
  }
  context.stroke();
  context.closePath();
 if (!emit) {
    return;
  }
  var w = canvaso.width;
  var h = canvaso.height;
//   channel.push('drawing', {
//     name: "drawing",
//     room: room,
//     data:{
//     x0: x0 / w,
//     y0: y0 / h,
//     x1: x1 / w,
//     y1: y1 / h,
//     color: colorPicked,
//     lineThickness: lineWidthPicked,
//     board : state.active
//  },
// });
}

//draw ellipse
function drawEllipse(x, y, w, h, color, linewidth, emit) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  var ox, oy, xe, ye, xm, ym;
  var kappa = 0.5522848;
  var ox = (w / 2) * kappa, // control point offset horizontal
    oy = (h / 2) * kappa, // control point offset vertical
    xe = x + w, // x-end
    ye = y + h, // y-end
    xm = x + w / 2, // x-middle
    ym = y + h / 2; // y-middle
  context.beginPath();
  context.moveTo(x, ym);
  context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  context.closePath();
  if (color) context.strokeStyle = color;
  else context.strokeStyle = colorPicked;
  if (linewidth) context.lineWidth = linewidth;
  else context.lineWidth = lineWidthPicked;
  context.stroke();
if (!emit) {
    return;
  }
  var canv_w = canvaso.width;
  var canv_h = canvaso.height;
 channel.push('ellipsedraw', {
    room: room,
  name: "ellipsedraw",
  data: {
    x: x,
    y: y,
    w: w,
    h: h,
    color: colorPicked,
    lineThickness: lineWidthPicked,
    board : state.active
  }});
}

//draw Lines
function drawLines(x0, y0, x1, y1, color, linewidth, emit) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  if (color) context.strokeStyle = color;
  else context.strokeStyle = colorPicked;
  if (linewidth) context.lineWidth = linewidth;
  else context.lineWidth = lineWidthPicked;
  context.stroke();
  context.closePath();
 if (!emit) {
    return;
  }
  var w = canvaso.width;
  var h = canvaso.height;
  channel.push('linedraw', {
    room:room,
    name: "linedraw",
    data:{
    x0: x0 / w,
    y0: y0 / h,
    x1: x1 / w,
    y1: y1 / h,
    color: colorPicked,
    lineThickness: lineWidthPicked,
    board : state.active
  }
});
}

//draw text
function DrawText(fsize, colorVal, textPosLeft, textPosTop, processed_lines,state, emit) {
  context.font = fsize;
  context.textBaseline = "top";
  context.fillStyle = colorVal;
  for (var n = 0; n < processed_lines.length; n++) {
    var processed_line = processed_lines[n];
    context.fillText(
      processed_line,
      parseInt(textPosLeft),
      parseInt(textPosTop) + n * parseInt(fsize)
    );
  }
  img_update(); //Already emitting no need true param
if (!emit) {
    return;
  }
  var w = canvaso.width;
  var h = canvaso.height;
   channel.push("textdraw", {
    room: room,
    name: "textdraw",
    data: {
      fsize: fsize,
      colorVal: colorVal,
      textPosLeft: textPosLeft,
      textPosTop: textPosTop,
      processed_linesArray: processed_lines,
      board : state.active
    },
  });
}

//trash
function clearAll_update(trans, canvas, canvaso,state) {
  console.log(canvas);
  context.clearRect(0, 0, canvas.width, canvas.height);
  contexto.clearRect(0, 0, canvaso.width, canvaso.height);
 if (!trans) {
    return;
  }
  channel.push("Clearboard", {
    name: "Clearboard",
    room: room,
    data: {
      CleardrawingBoard: true,
      board : state.active
    },
  });
}

export function addMouse(data) {
  console.log(data);
  if ($(`.for-board`).children(`#${data.user}`).length > 0) {
    $(`#${data.user}`).offset(data.cpos);
  } else {
    var mouse_div = document.createElement("div");
    var mouse_text = document.createElement("span");
    mouse_div.id = `${data.user}`;
    mouse_text.innerText = data.user;
    mouse_div.classList.add("mouse-text");
    var rgbColor =
      "rgb(" + colorGen() + "," + colorGen() + "," + colorGen() + ")";
    mouse_text.style.color = rgbColor;
     mouse_div.appendChild(mouse_text);
   $(`.for-board`).append(mouse_div);
    $(`#${data.user}`).offset(data.cpos);
  }
}

export  function onCanvasTransfer(data){
  img_update();
}

export function onDrawingEvent(data)
{
  console.log(data);
  var w = canvaso.width;
  var h = canvaso.height;
  drawPencil(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.lineThickness,data.board);
}

export function onDrawRect(data){
  var w = canvaso.width;
  var h = canvaso.height;
  drawRect(data.min_x * w, data.min_y * h, data.abs_x * w, data.abs_y * h, data.color, data.lineThickness);
}

export function backgroundColor(data) {
  $("#temp").css("background-color", data.color);
}

export  function onDrawLines(data){
  var w = canvaso.width;
  var h = canvaso.height;
  drawLines(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color, data.lineThickness);
}

export  function onDrawCircle(data){
  var w = canvaso.width;
  var h = canvaso.height;
  drawCircle(data.x1 * w, data.y1 * h, data.x2 * w, data.y2 * h, data.color, data.lineThickness);
}

export  function onDrawEllipse(data){
  var w = canvaso.width;
  var h = canvaso.height;
  drawEllipse(data.x, data.y, data.w, data.h, data.color, data.lineThickness);
}

export function onTextDraw(data){
  var w = canvaso.width;
  var h = canvaso.height;
  DrawText(data.fsize, data.colorVal, data.textPosLeft, data.textPosTop, data.processed_linesArray);
}



export function onClearAll(data){
  clearAll_update();
}
