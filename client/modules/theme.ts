import { deepmerge } from "@mui/utils";
import { Theme, createTheme, PaletteOptions } from "@mui/material/styles";
import { teal, pink, blueGrey, grey } from "@mui/material/colors";
import { jaJP } from "@mui/material/locale";

const defaultTheme = createTheme();

const lightPalette: PaletteOptions = {
  primary: { main: teal[500] },
  secondary: { main: pink["A200"] },
};

const darkPalette: PaletteOptions = {
  // primary: { main: blueGrey[800] },
  // secondary: { main: "#ce93d8" },
  // error: { main: "#f44336" },
  // warning: { main: "#ffa726" },
  // info: { main: "#29b6f6" },
  // success: { main: "#66bb6a" },
  // background: { default: "#121212", paper: "#121212" },
};

// Create a theme instance.
const theme = createTheme(
  deepmerge(defaultTheme, {
    palette: {
      mode: "light",
      ...lightPalette,
    },
  }),
  jaJP
);

export const getTheme = (mode: "light" | "dark"): Theme =>
  createTheme(
    deepmerge(defaultTheme, {
      palette: {
        mode: "light",
        ...(mode === "light" ? lightPalette : darkPalette),
      },
    }),
    jaJP
  );

export default theme;
