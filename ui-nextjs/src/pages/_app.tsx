import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProvider, useAppContext } from "../context/AppContext";
import { Layout } from "../components/layout/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AppProvider>
  );
}

function AppContent({
  Component,
  pageProps,
}: {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
}) {
  const { state } = useAppContext();

  const theme = createTheme({
    palette: {
      mode: state.darkMode ? "dark" : "light",
      primary: {
        main: "#3f51b5",
      },
      secondary: {
        main: "#f50057",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
