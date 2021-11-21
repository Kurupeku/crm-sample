import { FC, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { useRecoilState } from "recoil";
import {
  globalLoadingState,
  sessionState,
  currentStaffState,
} from "../modules/atoms";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Loader from "react-loader-spinner";
import { generateSessionData, AuthResponseData } from "../modules/jwt";
import { useSnackbar } from "notistack";
import { useGetStaffbyEmailQuery } from "../graphql/client";

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
  const [loading, setLoading] = useRecoilState(globalLoadingState);
  const [session, setSession] = useRecoilState(sessionState);
  const [currentStaff, setCurrentStaff] = useRecoilState(currentStaffState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, error } = useGetStaffbyEmailQuery({
    variables: { email: session?.email || "" },
    skip: !session,
  });

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
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.replace("/login");
      enqueueSnackbar("ログインしてください", { variant: "error" });
    } else {
      fetchRefreshToken(jwt)
        .then((response) => {
          setLoading(false);
          localStorage.setItem("jwt", response.data.token);
          setSession(generateSessionData(response.data));
        })
        .catch((err) => {
          setLoading(false);
          localStorage.removeItem("jwt");
          enqueueSnackbar("セッションが切れています", { variant: "error" });
          setSession(null);
          router.replace("/login");
        });
    }
  }, [router, enqueueSnackbar, setSession, setLoading]);

  useEffect(() => {
    if (!currentStaff) return;

    const id = setInterval(() => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        router.replace("/login");
        enqueueSnackbar("ログインしてください", { variant: "error" });
      } else {
        fetchRefreshToken(jwt)
          .then((response) => {
            localStorage.setItem("jwt", response.data.token);
            setSession(generateSessionData(response.data));
          })
          .catch((err) => {
            localStorage.removeItem("jwt");
            enqueueSnackbar("セッションが切れています", { variant: "error" });
            setSession(null);
            router.replace("/login");
          });
      }
    }, 60000);
    return () => clearInterval(id);
  }, [router, enqueueSnackbar, setSession]);

  return (
    <>
      <Box sx={{ m: 0, p: 0, opacity: currentStaff ? 1 : 0 }}>{children}</Box>
      {loading && (
        <Backdrop open={loading}>
          <Loader type="MutatingDots" height={100} width={100} />
        </Backdrop>
      )}
    </>
  );
};

export default GlobalStateProvider;
