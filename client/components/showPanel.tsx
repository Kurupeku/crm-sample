import { FC } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";
import ja from "date-fns/locale/ja";
import { getProperty } from "../modules/parser";

interface Data {
  [key: string]: any;
}

export interface Layout {
  name: string;
  label: string;
  type?: "string" | "number" | "date" | "datetime" | "boolean";
}

export interface Section {
  title?: string;
  layouts: Layout[];
}

interface Props {
  data?: Data;
  sections: Section[];
  maxColumn?: number;
  naked?: boolean;
  padding?: number;
}

const Wrapper: FC<{ naked?: boolean; padding?: number }> = ({
  children,
  naked,
  padding,
}) => {
  return naked ? (
    <>{children}</>
  ) : (
    <Paper sx={{ padding: padding || 2 }}>{children}</Paper>
  );
};

const parseValue = (value: any, type: Layout["type"]) => {
  switch (type) {
    case "boolean":
      return <Switch value={value || false} />;

    case "date":
    case "datetime":
      const formatStr = type === "date" ? "yyyy/MM/dd" : "yyyy/MM/dd HH:mm:ss";
      return format(fromUnixTime(value as number), formatStr, {
        locale: ja,
      });

    case "number":
      return value ? (value as number).toLocaleString() : 0;

    default:
      return String(value);
  }
};

const ShowPanel: FC<Props> = (props) => {
  const { data, sections, maxColumn, naked, padding } = props;
  const _mc = maxColumn || 2;
  const mc = sections.length < _mc ? sections.length : _mc;

  return (
    <Wrapper naked={naked} padding={padding}>
      <Grid container spacing={6}>
        {sections.map((sec, i) => (
          <Grid
            key={i}
            item
            xs={12}
            md={mc === 1 ? 12 : 6}
            lg={mc > 3 ? 4 : (Math.floor(12 / mc) as 1 | 2 | 3 | 4)}
            xl={mc > 4 ? 3 : (Math.floor(12 / mc) as 1 | 2 | 3)}
          >
            <Grid container spacing={2}>
              {sec.title ? (
                <Grid item xs={12}>
                  <Typography variant="h5" component="h3">
                    {sec.title}
                  </Typography>
                </Grid>
              ) : null}
              {sec.layouts.map((lay, i) => {
                const value = getProperty(data, lay.name);
                return (
                  <>
                    <Grid item xs={4}>
                      {lay.label}
                    </Grid>
                    <Grid item xs={8}>
                      {value ? parseValue(value, lay.type) : null}
                    </Grid>
                    {i !== sec.layouts.length - 1 ? (
                      <Grid item xs={12} columnSpacing={0}>
                        <Divider />
                      </Grid>
                    ) : null}
                  </>
                );
              })}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default ShowPanel;
