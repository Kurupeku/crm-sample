import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbar } from "notistack";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {
  useGetInquiryByIdQuery,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUsersListQuery,
  CreateUserInput,
  GetInquiryByIdQuery,
  GetUsersListQuery,
} from "../../../graphql/client";
import Breads from "../../../components/breadcrumbs";
import InquiryFormDialog, {
  FormData,
  RankMap,
} from "../../../components/inquiryFormDialog";
import UserFormDialog from "../../../components/userFormDialog";
import DeleteDialog from "../../../components/deleteDialog";
import { getProperty } from "../../../modules/parser";

interface Layout {
  label: string;
  key: string;
}

const baseLayouts: Layout[] = [
  { label: "ID", key: "id" },
  { label: "会社名", key: "companyName" },
  { label: "顧客名", key: "name" },
  { label: "Email", key: "email" },
  { label: "TEL", key: "tel" },
  { label: "利用想定人数", key: "numberOfUsers" },
  { label: "導入時期", key: "introductoryTerm" },
  { label: "詳細", key: "detail" },
];

const userLayouts: Layout[] = [
  { label: "ID", key: "id" },
  { label: "会社名", key: "companyName" },
  { label: "名前", key: "name" },
  { label: "email", key: "Email" },
  { label: "TEL", key: "tel" },
];

const addressLayouts: Layout[] = [
  { label: "郵便番号", key: "postalCode" },
  { label: "都道府県", key: "prefecture" },
  { label: "市区町村", key: "city" },
  { label: "町名・番地", key: "street" },
  { label: "建物名・号室", key: "building" },
];

const InquiryShow: FC = () => {
  const [form, setForm] = useState<FormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [userModalOpen, setUserModalOpen] = useState<boolean>(false);
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
        companyName: form?.companyName || "",
        detail: form?.detail || "",
        email: form?.email || "",
        introductoryTerm: form?.introductoryTerm || "",
        menuIds: form?.menuIds || [],
        name: form?.name || "",
        numberOfUsers: form?.numberOfUsers || 0,
        tel: form?.tel || "",
        progress: {
          staffId: form?.staffId,
          rank: form?.rank || 0,
        },
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
      menuIds: target.menus.map(({ id }) => parseInt(id)),
      numberOfUsers: target.numberOfUsers,
      tel: target.tel,
      staffId: target.progress.staffId || null,
      rank: target.progress ? RankMap[target.progress.rank.toLowerCase()] : 0,
    });
  };

  const handleFormChange = (key: string, value: unknown) => {
    if (!form) return;

    const newForm = { ...form, [key]: value as string };
    setForm(newForm);
  };

  const handleDelete = () => setDeleteId(id as string);

  return (
    <Grid container>
      <Grid item xs={12} lg={9}>
        <Container maxWidth="xl">
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
          <Grid container spacing={4} alignItems="stretch">
            <Grid item xs={12} lg={6}>
              <Paper sx={{ padding: 4, height: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h5" component="h3">
                      基本情報
                    </Typography>
                  </Grid>
                  {data?.inquiry
                    ? baseLayouts.map(({ label, key }) => (
                        <>
                          <Grid item xs={4}>
                            {label}
                          </Grid>
                          <Grid item xs={8}>
                            {getProperty(data.inquiry, key)}
                          </Grid>
                        </>
                      ))
                    : null}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper sx={{ padding: 4, height: "100%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ width: "100%", display: "flex" }}>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{ flexGrow: 1 }}
                      >
                        ユーザー情報
                      </Typography>
                      <Button
                        color="primary"
                        onClick={() => setUserModalOpen(true)}
                      >
                        {data?.inquiry?.user ? "ユーザー編集" : "ユーザー登録"}
                      </Button>
                    </Box>
                  </Grid>
                  {data?.inquiry?.user ? (
                    <>
                      {userLayouts.map(({ label, key }) => (
                        <>
                          <Grid item xs={4}>
                            {label}
                          </Grid>
                          <Grid item xs={8}>
                            {getProperty(data?.inquiry?.user, key)}
                          </Grid>
                        </>
                      ))}
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                      {data?.inquiry?.user?.address ? (
                        addressLayouts.map(({ label, key }) => (
                          <>
                            <Grid item xs={4}>
                              {label}
                            </Grid>
                            <Grid item xs={8}>
                              {getProperty(data?.inquiry?.user?.address, key)}
                            </Grid>
                          </>
                        ))
                      ) : (
                        <Grid item xs={12}>
                          住所未登録
                        </Grid>
                      )}
                    </>
                  ) : (
                    <Grid item xs={12}>
                      <Typography>ユーザー未登録</Typography>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
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
      </Grid>
      <Grid item xs={12} lg={3}></Grid>
      <UserFormDialog
        open={userModalOpen}
        inquiry={data?.inquiry}
        userId={data?.inquiry?.userId ? String(data.inquiry.userId) : undefined}
        defaultSearchValue={(data?.inquiry && data.inquiry.email) || undefined}
        refetchFunc={refetch}
        onClose={() => setUserModalOpen(false)}
      />
    </Grid>
  );
};

export default InquiryShow;
