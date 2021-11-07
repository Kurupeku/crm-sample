import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbar } from "notistack";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "../../../graphql/client";
import ShowPanel, { Section } from "../../../components/showPanel";
import Breads from "../../../components/breadcrumbs";
import FormDialog, {
  FormData,
  InputOption,
} from "../../../components/formDialog";
import DeleteDialog from "../../../components/deleteDialog";
import someoneAvatar from "../../../modules/avatar";

const sections: Section[] = [
  {
    layouts: [
      { name: "id", label: "ID" },
      { name: "name", label: "名前" },
      { name: "email", label: "Email" },
      { name: "createdAt", label: "作成日時", type: "datetime" },
      { name: "updatedAt", label: "更新日時", type: "datetime" },
    ],
  },
];

const inputOptions: InputOption[] = [
  { name: "name", label: "名前", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
];

const StaffShow: FC = (props) => {
  const [form, setForm] = useState<FormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = router.query;

  const { data, refetch } = useGetStaffByIdQuery({
    skip: !id,
    variables: { id: id as string },
  });

  const [updateAction, {}] = useUpdateStaffMutation({
    variables: {
      input: {
        id: (form?.id as string) || "",
        name: (form?.name as string) || "",
        email: (form?.email as string) || "",
      },
    },
    onCompleted: () => {
      setForm(null);
      refetch();
      enqueueSnackbar("情報を更新しました", { variant: "success" });
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const [deleteAction, {}] = useDeleteStaffMutation({
    variables: {
      input: { id: deleteId || "" },
    },
    onCompleted: () => {
      router.replace("/admin/staffs");
      enqueueSnackbar("スタッフを削除しました", { variant: "success" });
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const handleEdit = () => {
    if (!data) return;

    const target = data.staff;
    setForm({ id: target.id, name: target.name, email: target.email });
  };

  const handleFormChange = (key: string, value: unknown) => {
    if (!form) return;

    const newForm = { ...form, [key]: value as string };
    setForm(newForm);
  };

  const handleDelete = () => setDeleteId(id as string);

  return (
    <Container maxWidth="md" sx={{ marginTop: 2 }}>
      <Box sx={{ marginBottom: 2, display: "flex" }}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Breads naked />
        </Box>
        <Box>
          <Button onClick={handleEdit} sx={{ marginRight: 1 }}>
            編集
          </Button>
          <Button onClick={handleDelete} color="error">
            削除
          </Button>
        </Box>
      </Box>
      <Paper sx={{ padding: 4 }}>
        <Box
          sx={{
            margin: 2,
            width: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar src={data?.staff.icon || someoneAvatar} />
          <Button>画像を変更</Button>
        </Box>
        <ShowPanel data={data?.staff || {}} sections={sections} naked />
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "end", marginTop: 2 }}>
        <Link href="/admin/users">
          <Button color="inherit">一覧に戻る</Button>
        </Link>
      </Box>
      <FormDialog
        data={form}
        options={inputOptions}
        onChange={handleFormChange}
        onSubmit={() => updateAction()}
        onCancel={() => setForm(null)}
      />
      <DeleteDialog
        id={deleteId}
        onSubmit={deleteAction}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default StaffShow;
