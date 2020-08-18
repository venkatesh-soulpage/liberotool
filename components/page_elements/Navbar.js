import React from "react";

export default function Navbar(props) {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light border-bottom px-sm-5 px-4">
      <a className="navbar-brand px-0 px-sm-5" href="#">
        <img className="img-fluid logo" src={props.logo} />
      </a>
    </nav>
  );
}
