import { FC } from "react";
import Link from "next/link";
import { makeStyles, Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "middle",
    textAlign: "center",
  },
  body: {
    marginTop: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(4),
  },
}));

const NotFound: FC = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography component="h1" variant="h4">
        404: Not Found
      </Typography>
      <Typography variant="body1" className={classes.body}>
        指定のURLのページは見つかりませんでした。
        <Link href="/admin">Admin Home</Link>
      </Typography>
    </Container>
  );
};

export default NotFound;
