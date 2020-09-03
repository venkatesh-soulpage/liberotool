import React from "react";
//fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Button, Row, Tab, Tabs, Col, Nav, Dropdown, FormControl, Form } from "react-bootstrap";

function Tools(props) {
  const [tools] = React.useState([
    { name: "pencil", icon: "icons/pencil.svg" },
    { name: "eraser", icon: "icons/eraser.svg" },
    { name: "line", icon: "icons/line.svg" },
    { name: "rectangle", icon: "icons/rectangle.svg" },
    { name: "circle", icon: "icons/circle.svg" },
    { name: "ellipse", icon: "icons/ellipse.svg" },
    { name: "text", icon: "icons/text.svg" },
    { name: "trash", icon: "icons/trash.svg" },
    { name: "undo", icon: "icons/undo.svg" },
    { name: "redo", icon: "icons/redo.svg" },
  ]);
  const [active_tool, setActiveTool] = React.useState(0);

  const handleClick = (item, index) => {
    props.handleTool(item);
    setActiveTool(index);
  };

  const handleLineWidth = (e) => {
    console.log(e.target.value);
    props.handleLinewidth(e.target.value)
  };

  const handleFontSize = (e) => {};

  const handleColor = (e) => {};
  const handlebgColor = (e) => {};

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
            <FormControl  type="number" onChange={(e) => handleLineWidth(e)} />
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
    <div className="card mt-2 border-rounded shadow">
      <div className="card-body d-flex justify-content-around p-2 bg-light">
        {tools.map((item, index) => {
          return (
            <div
              className="text-center tool-item buttons"
              key={index}
              id={item}
              onClick={() => handleClick(item.name, index)}
              style={{ backgroundColor: active_tool === index && "#ffff" }}
            >
              <img src={item.icon} className={"img-fluid " + item.name} alt="" />
              <span className="d-block mt-2">{item.name}</span>
            </div>
          );
        })}

        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <FontAwesomeIcon icon={faEllipsisV} className="ml-2" />
            <span className="d-block mt-2">more</span>
          </Dropdown.Toggle>

          <Dropdown.Menu as={CustomMenu} className="custom-menu"></Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Tools;
