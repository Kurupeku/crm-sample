import { FC, useEffect, useMemo } from "react";
import { useRouter } from "next/dist/client/router";
import { useRecoilState } from "recoil";
import {
  globalLoadingState,
  sessionState,
  currentStaffState,
} from "../modules/atoms";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Backdrop } from "@mui/material";
import Loader from "react-loader-spinner";
import { generateSessionData, AuthResponseData } from "../modules/jwt";
import { useSnackbar } from "notistack";
import { useGetStaffbyEmailQuery } from "../graphql/client";
import Box from "@mui/material/Box";

const fetchRefreshToken = (token: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/refresh_token`;
  return axios.request<AuthResponseData>({
    url,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const GlobalStateProvider: FC = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [loading, setLoading] = useRecoilState(globalLoadingState);
  const [session, setSession] = useRecoilState(sessionState);
  const [currentStaff, setCurrentStaff] = useRecoilState(currentStaffState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, error } = useGetStaffbyEmailQuery({
    variables: { email: session?.email || "" },
    skip: !session,
  });

  const jwt = useMemo(() => cookies.jwt, [cookies]) as string | null;

  useEffect(() => {
    const newCurrentStaff = data?.staffByEmail;
    if (newCurrentStaff) setCurrentStaff(newCurrentStaff);
    else if (error)
      enqueueSnackbar("セッションからユーザー情報を取得できませんでした", {
        variant: "error",
      });
  }, [data, error, enqueueSnackbar, setCurrentStaff]);

  useEffect(() => {
    setLoading(true);
    if (!jwt) {
      router.replace("/login");
      enqueueSnackbar("ログインしてください", { variant: "error" });
    } else {
      fetchRefreshToken(jwt)
        .then((response) => {
          removeCookie("jwt");
          setCookie("jwt", response.data.token, { path: "/" });
          setSession(generateSessionData(response.data));
        })
        .catch((err) => {
          removeCookie("jwt");
          router.replace("/login");
          enqueueSnackbar("セッションが切れています", { variant: "error" });
          setSession(null);
        })
        .finally(() => setLoading(false));
    }
  }, [
    router,
    enqueueSnackbar,
    removeCookie,
    setCookie,
    setSession,
    setLoading,
  ]);

  useEffect(() => {
    if (!currentStaff) return;

    const id = setInterval(() => {
      if (!jwt) {
        router.replace("/login");
        enqueueSnackbar("ログインしてください", { variant: "error" });
      } else {
        fetchRefreshToken(jwt)
          .then((response) => {
            removeCookie("jwt");
            setCookie("jwt", response.data.token, { path: "/" });
            setSession(generateSessionData(response.data));
          })
          .catch((err) => {
            removeCookie("jwt");
            router.replace("/login");
            enqueueSnackbar("セッションが切れています", { variant: "error" });
            setSession(null);
          });
      }
    }, 60000);
    return () => clearInterval(id);
  }, [router, enqueueSnackbar, removeCookie, setCookie, setSession]);

  return (
    <>
      <Box sx={{ m: 0, p: 0 }}>{children}</Box>
      {loading && (
        <Backdrop open={loading}>
          <Loader type="MutatingDots" height={100} width={100} />
        </Backdrop>
      )}
    </>
  );
};

export default GlobalStateProvider;
