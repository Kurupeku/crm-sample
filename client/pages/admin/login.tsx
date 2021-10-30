import React, { useState, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { globalLoadingState, sessionState } from "../../modules/atoms";
import { useSnackbar } from "notistack";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircleProgress from "@material-ui/core/CircularProgress";
import { generateSessionData, AuthResponseData } from "../../modules/jwt";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [_session, setSession] = useRecoilState(sessionState);
  const [globalLoading, setGlobalLoading] = useRecoilState(globalLoadingState);
  const router = useRouter();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const jwt = cookies.jwt as string | null;
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
          router.replace("/admin");
        })
        .catch((err) => {
          console.error(err);
          removeCookie("jwt");
          setSession(null);
        })
        .finally(() => {
          setGlobalLoading(false);
        });
    }
  }, []);

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
        enqueueSnackbar("ログインしました", { variant: "success" });
        removeCookie("jwt");
        setCookie("jwt", response.data.token, { path: "/" });
        const sessionData = generateSessionData(response.data);
        setSession(sessionData);
        router.replace("/admin");
      })
      .catch((reasen) => {
        console.error(reasen);
        enqueueSnackbar("メールアドレスまたはパスワードが一致しません", {
          variant: "error",
        });
      })
      .finally(() => setLoading(false));
  };

  return globalLoading ? null : (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            CRM Sample System
          </Typography>
          <div className={classes.form}>
            <TextField
              value={email}
              onChange={handleEmail}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              value={password}
              onChange={handlePassword}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={email === "" || password === "" || loading}
              startIcon={
                loading ? <CircleProgress size={20} color="inherit" /> : null
              }
            >
              ログイン
            </Button>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
