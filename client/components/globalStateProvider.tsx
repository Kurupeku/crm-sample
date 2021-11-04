import { FC, useEffect, useMemo } from "react";
import { useRouter } from "next/dist/client/router";
import { useRecoilState, useSetRecoilState } from "recoil";
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
  const setCurrentStaff = useSetRecoilState(currentStaffState);
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
  }, [data, error]);

  useEffect(() => {
    const jwt = cookies.jwt as string | null;
    if (!jwt) {
      router.replace("/admin/login");
    } else {
      fetchRefreshToken(jwt)
        .then((response) => {
          removeCookie("jwt");
          setCookie("jwt", response.data.token, { path: "/" });
          setSession(generateSessionData(response.data));
        })
        .catch((err) => {
          removeCookie("jwt");
          router.replace("/admin/login");
          console.error(err);
          enqueueSnackbar("セッションが切れています", { variant: "error" });
          setSession(null);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const jwt = cookies.jwt as string | null;
      if (!jwt) {
        router.replace("/admin/login");
      } else {
        fetchRefreshToken(jwt)
          .then((response) => {
            console.log(response.data);
            removeCookie("jwt");
            setCookie("jwt", response.data.token, { path: "/" });
            setSession(generateSessionData(response.data));
          })
          .catch((err) => {
            removeCookie("jwt");
            router.replace("/admin/login");
            console.error(err);
            enqueueSnackbar("セッションが切れています", { variant: "error" });
            setSession(null);
          });
      }
    }, 300000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {children}
      {loading ? (
        <Backdrop open={loading}>
          <Loader type="MutatingDots" height={100} width={100} />
        </Backdrop>
      ) : null}
    </>
  );
};

export default GlobalStateProvider;
