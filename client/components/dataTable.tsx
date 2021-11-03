import { Fragment, FC, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ApolloError } from "@apollo/client";
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";
import ja from "date-fns/locale/ja";
import { styled, alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import TableFooter from "@mui/material/TableFooter";
import LinerProgress from "@mui/material/LinearProgress";
import InputBase from "@mui/material/InputBase";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { visuallyHidden } from "@mui/utils";

export interface ColumnProps {
  label: string;
  key: string;
  type: "string" | "integer" | "float" | "date" | "datetime" | "avatar";
  format?: string;
  width?: number | string;
  disableSort?: boolean;
}

export interface RowProps {
  id: string;
  [key: string]: any;
}

export interface HeadCellProps {
  column: ColumnProps;
  orderBy?: string;
  order?: "asc" | "desc";
  colSpan?: number;
  onOrderClick?: (orderBy: string, order: "asc" | "desc") => void;
}

export interface HeadRowProps {
  columns: ColumnProps[];
  orderBy?: string;
  order?: "asc" | "desc";
  linkColumnWidth?: string | number;
  onOrderClick?: (orderBy: string, order: "asc" | "desc") => void;
}

export interface DataCellProps {
  column: ColumnProps;
  row: RowProps;
}

export interface DataRowProps {
  columns: ColumnProps[];
  row: RowProps;
  path: string;
  actionButtonsColor: "default" | "inherit" | "primary" | "secondary";
  onEditButtonClick?: (id: string) => void;
  onDeleteButtonClick?: (id: string) => void;
}

export interface DataTableProps {
  title?: string;
  columns: ColumnProps[];
  rows?: RowProps[];
  loading: boolean;
  error?: ApolloError;
  errorMessage?: string;
  per: number;
  page: number;
  recordCount?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  addButtonColor?: "default" | "inherit" | "primary" | "secondary";
  actionButtonsColor?: "default" | "inherit" | "primary" | "secondary";
  disableSearch?: boolean;
  searchLabel?: string;
  linkColumnWidth?: string | number;
  customLinksFunc?: (row: RowProps) => ReactNode;
  onPerChange?: (value: number) => void;
  onPageChange?: (value: number) => void;
  onSearchSubmit?: (value: string) => void;
  onOrderClick?: (orderBy: string, order: "asc" | "desc") => void;
  onNewButtonClick?: () => void;
  onEditButtonClick?: (id: string) => void;
  onDeleteButtonClick?: (id: string) => void;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.grey[300], 0.35),
  "&:hover": {
    backgroundColor: alpha(theme.palette.grey[300], 0.45),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 0),
  height: "100%",
  position: "absolute",
  pointerEvents: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const HeadCell: FC<HeadCellProps> = (props) => {
  const { column, orderBy, order, colSpan, onOrderClick } = props;
  const { label, key, type, width, disableSort } = column;
  const [align, setAlign] = useState<
    "left" | "right" | "inherit" | "center" | "justify"
  >("left");
  const sortable = !disableSort && onOrderClick && type !== "avatar";
  const direction = orderBy === key ? order : false;
  const nextDirection = !direction || order === "desc" ? "asc" : "desc";
  const span = colSpan || 1;

  useEffect(() => {
    switch (type) {
      case "integer":
      case "float":
        setAlign("right");
        break;

      case "avatar":
        setAlign("justify");
        break;

      default:
        setAlign("left");
        break;
    }
  }, []);

  const handleOrder = () => {
    if (!onOrderClick) return;

    onOrderClick(key, nextDirection);
  };

  return sortable ? (
    <TableCell
      variant="head"
      component="th"
      colSpan={span}
      key={`head-${key}`}
      width={width}
      align={align}
      sortDirection={orderBy === key ? order : false}
    >
      <TableSortLabel
        active={orderBy === key}
        direction={orderBy === key ? order : "asc"}
        onClick={handleOrder}
      >
        {label}
        {orderBy === key ? (
          <Box component="span" sx={visuallyHidden}>
            {order === "desc" ? "sorted descending" : "sorted ascending"}
          </Box>
        ) : null}
      </TableSortLabel>
    </TableCell>
  ) : (
    <TableCell
      variant="head"
      component="th"
      colSpan={span}
      key={`head-${key}`}
      width={width}
      align={align}
    >
      {label}
    </TableCell>
  );
};

const HeadRow: FC<HeadRowProps> = (props) => {
  const { columns, orderBy, order, linkColumnWidth, onOrderClick } = props;

  return (
    <TableRow>
      {columns.map((column, i) => (
        <HeadCell
          key={column.key}
          column={column}
          orderBy={orderBy}
          order={order}
          onOrderClick={onOrderClick}
        />
      ))}
      <TableCell width={linkColumnWidth || 150} align="center" />
    </TableRow>
  );
};

const DataCell = (props: DataCellProps) => {
  const { column, row } = props;
  const { key, type, width, format: f } = column;
  const value = row[key];

  if (!value) return <TableCell key={`${key}`}></TableCell>;

  switch (type) {
    case "integer":
      return (
        <TableCell key={`body-${key}`} width={width} align="right">
          {parseInt(value, 10).toLocaleString()}
        </TableCell>
      );

    case "float":
      return (
        <TableCell key={`body-${key}`} width={width} align="right">
          {parseFloat(value).toLocaleString()}
        </TableCell>
      );

    case "date":
    case "datetime":
      const formatStr: string =
        f || type === "date" ? "yyyy/MM/dd" : "yyyy/MM/dd HH:mm:ss";
      const dateStr = format(fromUnixTime(value), formatStr, {
        locale: ja,
      });
      return (
        <TableCell key={`body-${key}`} width={width}>
          {dateStr}
        </TableCell>
      );

    case "avatar":
      return (
        <TableCell key={`body-${key}`} width={40} align="center">
          <Avatar alt={`icon_${key}`} src={value} />
        </TableCell>
      );

    case "string":
      return (
        <TableCell key={`body-${key}`} width={width}>
          {String(value)}
        </TableCell>
      );

    default:
      return (
        <TableCell key={`body-${key}`} width={width} align="center">
          {value}
        </TableCell>
      );
  }
};

const DataRow: FC<DataRowProps> = (props) => {
  const {
    columns,
    row,
    path,
    actionButtonsColor,
    onEditButtonClick,
    onDeleteButtonClick,
  } = props;

  return (
    <TableRow hover>
      {columns.map((column) => (
        <DataCell key={column.key} column={column} row={row} />
      ))}
      <TableCell padding="none" align="center">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link href={`${path}/${row.id}`}>
            <IconButton size="small" color={actionButtonsColor}>
              <InfoOutlinedIcon />
            </IconButton>
          </Link>
          <IconButton
            size="small"
            color={actionButtonsColor}
            onClick={() => onEditButtonClick && onEditButtonClick(row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            color={actionButtonsColor}
            onClick={() => onDeleteButtonClick && onDeleteButtonClick(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
};

const DataTable: FC<DataTableProps> = (props) => {
  const {
    title,
    columns,
    rows,
    loading,
    error,
    errorMessage,
    per,
    page,
    orderBy,
    order,
    recordCount,
    searchLabel,
    disableSearch,
    addButtonColor,
    actionButtonsColor,
    onOrderClick,
    onSearchSubmit,
    onPageChange,
    onPerChange,
    onNewButtonClick,
    onEditButtonClick,
    onDeleteButtonClick,
  } = props;
  const [search, setSearch] = useState("");
  const router = useRouter();
  const currentPath = router.pathname;
  const colSpan = columns.length + 1;

  const handleSearchSubmit = () => onSearchSubmit && onSearchSubmit(search);

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange && onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onPerChange && onPerChange(parseInt(event.target.value, 10));
    onPageChange && onPageChange(1);
  };

  return (
    <Paper>
      <Toolbar>
        {title ? (
          <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        ) : (
          <Box component="div" sx={{ flexGrow: 1 }}></Box>
        )}
        {!disableSearch && onSearchSubmit && (
          <Search>
            <SearchIconWrapper>
              <IconButton onClick={handleSearchSubmit}>
                <SearchIcon />
              </IconButton>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={searchLabel || "検索"}
              inputProps={{ "aria-label": "search" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Search>
        )}
        <IconButton
          color={addButtonColor || "primary"}
          onClick={onNewButtonClick}
        >
          <AddIcon />
        </IconButton>
      </Toolbar>
      <TableContainer>
        <Table style={{ width: "100%" }}>
          <TableHead>
            <HeadRow
              columns={columns}
              orderBy={orderBy}
              order={order}
              onOrderClick={onOrderClick}
            />
            {loading && (
              <TableRow>
                <TableCell colSpan={colSpan} padding="none">
                  <LinerProgress />
                </TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {error || !rows ? (
              <TableRow>
                <TableCell colSpan={colSpan} align="center">
                  <Typography variant="inherit">
                    {errorMessage || "データの取得に失敗しました"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <DataRow
                  key={`row-${i}`}
                  columns={columns}
                  row={row}
                  path={currentPath}
                  actionButtonsColor={actionButtonsColor || "default"}
                  onEditButtonClick={onEditButtonClick}
                  onDeleteButtonClick={onDeleteButtonClick}
                />
              ))
            )}
          </TableBody>
          <TableFooter>
            <TablePagination
              colSpan={colSpan}
              rowsPerPageOptions={[5, 10, 25]}
              count={recordCount || 0}
              rowsPerPage={per}
              page={page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="表示件数:"
              labelDisplayedRows={({ from, to, count }) =>
                count > 0 ? `${count}件中${from}~${to}件を表示中` : "0件"
              }
            />
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DataTable;
