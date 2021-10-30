import { FC, useEffect, useMemo } from "react";
import { useRouter } from "next/dist/client/router";
import { useRecoilState } from "recoil";
import {
  themeTypeState,
  globalLoadingState,
  sessionState,
} from "../modules/atoms";
import { useCookies } from "react-cookie";
import axios from "axios";
import { createTheme } from "@material-ui/core";
import {
  ThemeProvider,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core/styles";
import { Backdrop } from "@material-ui/core";
import Loader from "react-loader-spinner";
import overrideColors from "../modules/overrideColors";
import { generateSessionData, AuthResponseData } from "../modules/jwt";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 2,
      color: "#fff",
    },
  })
);

const GlobalStateProvider: FC = ({ children }) => {
  const [themeType, setThemeType] = useRecoilState(themeTypeState);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [loading, setLoading] = useRecoilState(globalLoadingState);
  const [_session, setSession] = useRecoilState(sessionState);
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          ...overrideColors,
          type: themeType,
        },
      }),
    [themeType]
  );

  useEffect(() => {
    const localType =
      (localStorage.getItem("type") as "light" | "dark" | null) || "light";
    setThemeType(localType);
  }, []);

  useEffect(() => {
    const jwt = cookies.jwt as string | null;
    if (!jwt) router.replace("/admin/login");
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/refresh_token`;
    axios
      .request<AuthResponseData>({
        url,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((response) => {
        removeCookie("jwt");
        setCookie("jwt", response.data.token, { path: "/" });
        const sessionData = generateSessionData(response.data);
        setSession(sessionData);
      })
      .catch((err) => {
        enqueueSnackbar("セッションが切れています", { variant: "error" });
        console.error(err);
        removeCookie("jwt");
        setSession(null);
        router.replace("/admin/login");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {children}
      {loading ? (
        <Backdrop className={classes.backdrop} open={loading}>
          <Loader
            type="MutatingDots"
            color={theme.palette.primary[themeType]}
            secondaryColor={theme.palette.secondary[themeType]}
            height={100}
            width={100}
          />
        </Backdrop>
      ) : (
        <></>
      )}
    </ThemeProvider>
  );
};

export default GlobalStateProvider;
