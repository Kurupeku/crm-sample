import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/dist/client/router";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRecoilState, useSetRecoilState } from "recoil";
import { globalLoadingState, sessionState } from "../modules/atoms";
import { useSnackbar } from "notistack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import CircleProgress from "@mui/material/CircularProgress";
import { generateSessionData, AuthResponseData } from "../modules/jwt";
import { createTheme, ThemeProvider } from "@mui/material";
import { teal, pink } from "@mui/material/colors";

const publicTheme = createTheme({
  palette: {
    primary: { main: teal[500] },
    secondary: { main: pink["A200"] },
  },
});

export default function Login() {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const setSession = useSetRecoilState(sessionState);
  const setGlobalLoading = useSetRecoilState(globalLoadingState);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const jwt = useMemo(() => cookies.jwt, [cookies]) as string | null;

  useEffect(() => {
    if (jwt) {
      setGlobalLoading(true);
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
          enqueueSnackbar("ログイン中です", { variant: "success" });
          removeCookie("jwt");
          setCookie("jwt", response.data.token, { path: "/" });
          const sessionData = generateSessionData(response.data);
          setSession(sessionData);
          router.replace("/");
        })
        .catch((err) => {
          removeCookie("jwt");
          setSession(null);
        })
        .finally(() => {
          setGlobalLoading(false);
        });
    }
  }, [
    router,
    enqueueSnackbar,
    removeCookie,
    setCookie,
    setSession,
    setLoading,
  ]);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.currentTarget.value);

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const handleSubmit = () => {
    setLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/login`;
    axios
      .request<AuthResponseData>({
        url,
        method: "POST",
        data: { email, password },
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        removeCookie("jwt");
        setCookie("jwt", response.data.token, { path: "/" });
        const sessionData = generateSessionData(response.data);
        setSession(sessionData);
        router.replace("/");
        enqueueSnackbar("ログインしました", { variant: "success" });
      })
      .catch(() => {
        enqueueSnackbar("メールアドレスまたはパスワードが一致しません", {
          variant: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <ThemeProvider theme={publicTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="div" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="メールアドレス"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleEmail}
                onKeyPress={(e) => {
                  if (e.key == "Enter") handleSubmit();
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="パスワード"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePassword}
                onKeyPress={(e) => {
                  if (e.key == "Enter") handleSubmit();
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading && <CircleProgress size={20} />}
              >
                サインイン
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
