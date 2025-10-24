import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { AppProps } from "next/app";
import { Layout } from "../components/layout/Layout";
import { AppProvider, useAppContext } from "../context/AppContext";
import "../styles/globals.css";

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
