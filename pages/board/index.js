import React from "react";
import Head from "next/head";
import MainLayout from "layouts/MainLayout";
import { Button, Row, Tab, Tabs, Col, Nav, Dropdown, FormControl, Form } from "react-bootstrap";
//fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
//components
import { Navbar } from "components/page_elements";
import { WhiteBoard } from "components/page_views";

function Board(props) {
  return (
    <div>
      <Head>
        <title>Whiteboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Navbar logo="icons/boards_logo.svg" /> */}

      <WhiteBoard />
    </div>
  );
}

export default Board;
