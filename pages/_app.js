import React from "react";
// next imports
import App from "next/app";
import Router from "next/router";
// styled Components
import { ThemeProvider } from "styled-components";
// Theme
import { theme } from "styles/theme";
// axios config
import "config/axios_configuration";
// sentry configuration
import "config/sentry_configuration";
// Stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
// app css
import "styles/css/App.css";
// fontawesome
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
config.autoAddCss = false;
// nprogress
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Router.events.on("routeChangeStart", (url) => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});

Router.events.on("routeChangeError", () => {
  NProgress.done();
});

class MyApp extends App {
  render() {
    const { Component, pageProps, err } = this.props;
    const Layout = Component.Layout || React.Fragment;
    const modifiedPageProps = { ...pageProps, err };
    return (
      <>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...modifiedPageProps} />
          </Layout>
        </ThemeProvider>
      </>
    );
  }
}

export default MyApp;
