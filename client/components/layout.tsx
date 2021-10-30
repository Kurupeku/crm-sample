import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/dist/client/router";
import { useRecoilState, useResetRecoilState } from "recoil";
import { sessionState, themeTypeState } from "../modules/atoms";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import BrightnessMediumIcon from "@material-ui/icons/BrightnessMedium";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DrawerMenu from "./drawerMenu";
import { useCookies } from "react-cookie";
import { useSnackbar } from "notistack";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    appBarToolbar: {
      display: "flex",
    },
    appBarTitle: {
      flexGrow: 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      height: "100vh",
      backgroundColor:
        theme.palette.type === "dark"
          ? "#121212"
          : theme.palette.background.default,
    },
  })
);

const Layout: React.FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [themeType, setThemeType] = useRecoilState(themeTypeState);
  const resetSession = useResetRecoilState(sessionState);
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const [_cookies, _setCookie, removeCookie] = useCookies(["jwt"]);
  const { enqueueSnackbar } = useSnackbar();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const switchType = () => {
    const newThemeType = themeType === "light" ? "dark" : "light";
    localStorage.setItem("type", newThemeType);
    setThemeType(newThemeType);
  };

  const handleLogout = () => {
    removeCookie("jwt");
    resetSession();
    enqueueSnackbar("ログアウトしました", { variant: "success" });
    router.replace("/admin/login");
  };

  return (
    <div className={classes.root}>
      <AppBar
        color={themeType == "light" ? "primary" : "default"}
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.appBarToolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.appBarTitle}>
            CRM Sample
          </Typography>
          <IconButton color="inherit" onClick={switchType}>
            <BrightnessMediumIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <DrawerMenu />
      </Drawer>
      <Box className={classes.content}>{children}</Box>
    </div>
  );
};

export default Layout;
