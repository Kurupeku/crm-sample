import React, { FC, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { useResetRecoilState } from "recoil";
import { sessionState } from "../modules/atoms";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";
import {
  styled,
  Theme,
  CSSObject,
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BrightnessMediumIcon from "@mui/icons-material/BrightnessMedium";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import DrawerMenu from "./drawerMenu";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Layout: FC = ({ children }) => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const resetSession = useResetRecoilState(sessionState);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [_cookies, _setCookie, removeCookie] = useCookies(["jwt"]);
  const { enqueueSnackbar } = useSnackbar();

  const privateTheme: Theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light" ? { background: { default: grey[200] } } : {}),
        },
        typography: { fontSize: 12 },
      }),
    [mode]
  );

  useEffect(() => {
    const localMode =
      (localStorage.getItem("mode") as "light" | "dark" | null) || "light";
    setMode(localMode);
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const switchType = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  const handleLogout = () => {
    router.replace("/admin/login");
    removeCookie("jwt");
    resetSession();
    enqueueSnackbar("ログアウトしました", { variant: "success" });
  };

  return (
    <ThemeProvider theme={privateTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{
                flexGrow: 1,
              }}
            >
              CRM Sample App
            </Typography>
            <IconButton color="inherit" onClick={switchType}>
              <BrightnessMediumIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {privateTheme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <DrawerMenu />
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            pb: 4,
            backgroundColor: (t) => t.palette.background.default,
          }}
        >
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
