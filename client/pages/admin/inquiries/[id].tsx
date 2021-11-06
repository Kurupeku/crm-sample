import { FC, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbar } from "notistack";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  useGetInquiryByIdQuery,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} from "../../../graphql/client";
import Breads from "../../../components/breadcrumbs";
import InquiryFormDialog, {
  FormData,
} from "../../../components/inquiryFormDialog";
import DeleteDialog from "../../../components/deleteDialog";

const InquiryShow: FC = () => {
  const [form, setForm] = useState<FormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = router.query;

  const { data, refetch } = useGetInquiryByIdQuery({
    skip: !id,
    variables: { inquiryId: id as string },
  });

  const [updateAction, {}] = useUpdateInquiryMutation({
    variables: {
      input: {
        id: form?.id || "",
        companyName: (form?.companyName as string) || "",
        detail: form?.detail || "",
        email: form?.email || "",
        introductoryTerm: form?.name || "",
        menuIds: form?.menuIds || [],
        name: form?.name || "",
        numberOfUsers: form?.numberOfUsers || 0,
        tel: form?.tel || "",
      },
    },
    onCompleted: () => {
      setForm(null);
      refetch();
      enqueueSnackbar("問い合わせ内容を更新しました", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  const [deleteAction, {}] = useDeleteInquiryMutation({
    variables: {
      input: { id: deleteId || "" },
    },
    onCompleted: () => {
      router.replace("/admin/inquiries");
      enqueueSnackbar("問い合わせを削除しました", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  const handleEdit = () => {
    if (!data?.inquiry) return;

    const target = data.inquiry;
    setForm({
      id: target.id,
      companyName: target.companyName || "",
      name: target.name,
      detail: target.detail || "",
      email: target.email,
      introductoryTerm: target.introductoryTerm,
      menuIds: target.menus.map((r) => parseInt(r.id, 10)) || [],
      numberOfUsers: target.numberOfUsers,
      tel: target.tel,
    });
  };

  const handleFormChange = (key: string, value: unknown) => {
    if (!form) return;

    const newForm = { ...form, [key]: value as string };
    setForm(newForm);
  };

  const handleDelete = () => setDeleteId(id as string);

  return (
    <Container maxWidth="md">
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
      <Paper sx={{ padding: 4 }}></Paper>
      <Box sx={{ display: "flex", justifyContent: "end", marginTop: 2 }}>
        <Link href="/admin/inquiries">
          <Button color="inherit">一覧に戻る</Button>
        </Link>
      </Box>
      <InquiryFormDialog
        data={form}
        onCancel={() => setForm(null)}
        onChange={handleFormChange}
        onSubmit={updateAction}
      />
      <DeleteDialog
        id={deleteId}
        onSubmit={deleteAction}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default InquiryShow;
