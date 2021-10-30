import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { NextRouter } from "next/dist/client/router";
import { RecoilRoot } from "recoil";
import { SnackbarProvider } from "notistack";
import { createTheme } from "@material-ui/core";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { CookiesProvider } from "react-cookie";
import GlobalStateProvider from "../components/globalStateProvider";
import Layout from "../components/layout";
import overrideColors from "../modules/overrideColors";

const loginPath = /^\/admin\/login\/?$/;

const isMatchLoginPath = (router: NextRouter) => {
  return loginPath.test(router.pathname);
};

const CustomApp = ({ Component, pageProps, router }: AppProps): JSX.Element => {
  const theme = createTheme({
    palette: {
      ...overrideColors,
      type: "light",
    },
  });

  useEffect(() => {
    const jssStyles: Element | null =
      document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <RecoilRoot>
      <CookiesProvider>
        <SnackbarProvider maxSnack={3}>
          <StylesProvider injectFirst>
            <CssBaseline />
            <ThemeProvider theme={theme}>
              {isMatchLoginPath(router) ? (
                <Component {...pageProps} />
              ) : (
                <GlobalStateProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </GlobalStateProvider>
              )}
            </ThemeProvider>
          </StylesProvider>
        </SnackbarProvider>
      </CookiesProvider>
    </RecoilRoot>
  );
};

export default CustomApp;
