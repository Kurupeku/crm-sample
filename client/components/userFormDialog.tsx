import { FC, useState, useEffect, forwardRef } from "react";
import { useSnackbar } from "notistack";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  useUpdateInquiryMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUsersListQuery,
  GetInquiryByIdQuery,
} from "../graphql/client";

interface Layout {
  label: string;
  key: string;
}

interface UserFormProps {
  open: boolean;
  userId?: string;
  inquiry?: GetInquiryByIdQuery["inquiry"];
  defaultSearchValue?: string;
  refetchFunc?: () => void;
  onClose: () => void;
}

interface UserForm {
  companyName: string;
  email: string;
  name: string;
  tel: string;
  postalCode: string;
  prefecture: string;
  city: string;
  street: string;
  building: string;
  [key: string]: string;
}

const userFormLayouts: Layout[] = [
  { label: "会社名", key: "companyName" },
  { label: "顧客名", key: "name" },
  { label: "Email", key: "email" },
  { label: "TEL", key: "tel" },
  { label: "郵便番号", key: "postalCode" },
  { label: "都道府県", key: "prefecture" },
  { label: "市区町村", key: "city" },
  { label: "町名・番地", key: "street" },
  { label: "建物名・号室", key: "building" },
];

const newFormProp: UserForm = {
  companyName: "",
  name: "",
  email: "",
  tel: "",
  postalCode: "",
  prefecture: "",
  city: "",
  street: "",
  building: "",
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UserFormDialog: FC<UserFormProps> = (props) => {
  const { open, userId, inquiry, defaultSearchValue, refetchFunc, onClose } =
    props;
  const [index, setIndex] = useState<number>(0);
  const [per, setPer] = useState<number>(25);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>(defaultSearchValue || "");
  const [form, setForm] = useState<UserForm>(newFormProp);
  const { enqueueSnackbar } = useSnackbar();

  const { data: usersData, loading } = useGetUsersListQuery({
    skip: !search,
    variables: {
      page,
      per,
      fieldsCont: search,
    },
  });

  const [createAction, {}] = useCreateUserMutation({
    variables: {
      input: {
        companyName: form.companyName || "",
        name: form.name,
        email: form.email,
        tel: form.tel,
        address: {
          postalCode: form.postalCode,
          prefecture: form.prefecture,
          city: form.city,
          street: form.street,
          building: form.building || "",
        },
      },
    },
    onCompleted: () => {
      refetchFunc && refetchFunc();
      enqueueSnackbar("ユーザーを新規登録しました", { variant: "success" });
      onClose();
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const [updateAction, {}] = useUpdateUserMutation({
    variables: {
      input: {
        id: userId || "",
        companyName: form.companyName || "",
        name: form.name,
        email: form.email,
        tel: form.tel,
        address: {
          postalCode: form.postalCode,
          prefecture: form.prefecture,
          city: form.city,
          street: form.street,
          building: form.building || "",
        },
      },
    },
    onCompleted: () => {
      refetchFunc && refetchFunc();
      enqueueSnackbar("ユーザー情報を更新しました", { variant: "success" });
      onClose();
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const [updateInquiry, {}] = useUpdateInquiryMutation({
    onCompleted: () => {
      refetchFunc && refetchFunc();
      enqueueSnackbar("ユーザーを割り当てました", { variant: "success" });
      onClose();
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  useEffect(() => {
    if (!inquiry) return;

    if (!inquiry.user) {
      setForm(newFormProp);
    } else {
      setForm({
        companyName: inquiry.user.companyName || "",
        name: inquiry.user.name,
        email: inquiry.user.email,
        tel: inquiry.user.tel,
        postalCode: inquiry.user.address.postalCode,
        prefecture: inquiry.user.address.prefecture,
        city: inquiry.user.address.city,
        street: inquiry.user.address.street,
        building: inquiry.user.address.building || "",
      });
    }
  }, [inquiry]);

  const handleSubmit = () => {
    if (userId) updateAction();
    else createAction();
  };

  const handleChange = (key: string, value: string) => {
    const newForm = { ...form, [key]: value };
    setForm(newForm);
  };

  return !inquiry ? null : (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Transition}
      PaperProps={{ sx: { bgcolor: "background.default" } }}
    >
      <DialogContent>
        <Container maxWidth="md">
          <AppBar position="static" color="default" elevation={0}>
            <Tabs
              value={index}
              onChange={(_, v) => setIndex(v)}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="既存顧客割当" tabIndex={0} />
              <Tab label={userId ? "登録内容更新" : "新規登録"} tabIndex={1} />
            </Tabs>
          </AppBar>
          <Paper sx={{ p: 2 }}>
            {index === 0 ? (
              <>
                <TextField
                  autoFocus
                  id="search"
                  type="search"
                  label="検索キーワード"
                  placeholder="会社名/顧客名/Emailなどで検索"
                  variant="standard"
                  fullWidth
                  margin="normal"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell variant="head">ID</TableCell>
                      <TableCell variant="head">会社名</TableCell>
                      <TableCell variant="head">顧客名</TableCell>
                      <TableCell variant="head">Email</TableCell>
                      <TableCell variant="head"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          検索中...
                        </TableCell>
                      </TableRow>
                    ) : !usersData || usersData.usersList.users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          検索ワードを入力してください
                        </TableCell>
                      </TableRow>
                    ) : (
                      usersData.usersList.users.map((user) => (
                        <TableRow>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.companyName}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() =>
                                updateInquiry({
                                  variables: {
                                    input: {
                                      id: inquiry.id,
                                      userId: parseInt(user.id, 10),
                                    },
                                  },
                                })
                              }
                            >
                              割当
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TablePagination
                      colSpan={5}
                      count={usersData?.usersList.pageInfo.recordsCount || 0}
                      rowsPerPage={25}
                      page={page - 1}
                      labelRowsPerPage="表示件数:"
                      labelDisplayedRows={({ from, to, count }) =>
                        count > 0
                          ? `${count}件中${from}~${to}件を表示中`
                          : "0件"
                      }
                      onPageChange={(_, p) => setPage(p + 1)}
                      onRowsPerPageChange={(e) =>
                        setPer(parseInt(e.target.value, 10))
                      }
                    />
                  </TableFooter>
                </Table>
              </>
            ) : (
              userFormLayouts.map((layout, i) => (
                <TextField
                  autoFocus={i === 0}
                  id={layout.key}
                  label={layout.label}
                  type={layout.key === "email" ? "email" : "text"}
                  fullWidth
                  variant="standard"
                  value={form[layout.key] || ""}
                  margin="normal"
                  onChange={(e) => handleChange(layout.key, e.target.value)}
                />
              ))
            )}
          </Paper>
        </Container>
      </DialogContent>
      <DialogActions>
        <Container
          maxWidth="md"
          sx={{ display: "flex", justifyContent: "end" }}
        >
          <Button onClick={onClose} color="inherit" variant="contained">
            キャンセル
          </Button>
          {index !== 0 ? (
            <Button
              color="primary"
              variant="contained"
              sx={{ marginLeft: 2 }}
              onClick={handleSubmit}
            >
              保存
            </Button>
          ) : null}
        </Container>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormDialog;
