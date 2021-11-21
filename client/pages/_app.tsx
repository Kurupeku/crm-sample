import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { NextRouter } from "next/dist/client/router";
import { RecoilRoot } from "recoil";
import { SnackbarProvider } from "notistack";
import { CacheProvider, EmotionCache } from "@emotion/react";
import GlobalStateProvider from "../components/globalStateProvider";
import Layout from "../components/layout";
import { ApolloProvider } from "@apollo/client";
import { client } from "../modules/apolloClient";
import createEmotionCache from "../modules/craeteEmotionCache";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import ja from "date-fns/locale/ja";

const loginPath = /^\/login\/?$/;

const isMatchLoginPath = (router: NextRouter) => {
  return loginPath.test(router.pathname);
};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    router,
  } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>CRM Sample App</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <RecoilRoot>
        <SnackbarProvider maxSnack={10}>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ja}>
            {isMatchLoginPath(router) ? (
              <Component {...pageProps} />
            ) : (
              <ApolloProvider client={client}>
                <GlobalStateProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </GlobalStateProvider>
              </ApolloProvider>
            )}
          </LocalizationProvider>
        </SnackbarProvider>
      </RecoilRoot>
    </CacheProvider>
  );
}
