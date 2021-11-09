import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import {
  useGetInquiryByIdQuery,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} from "../../graphql/client";
import Breads from "../../components/breadcrumbs";
import InquiryFormDialog, {
  FormData,
  RankMap,
} from "../../components/inquiryFormDialog";
import UserFormDialog from "../../components/userFormDialog";
import DeleteDialog from "../../components/deleteDialog";
import CommentsDialog from "../../components/commentsDialog";
import StaffSelector from "../../components/staffSelector";
import RankSelector from "../../components/rankSelector";
import StateChanger from "../../components/stateChanger";
import RecontactedOnPicker from "../../components/recontactedOnPicker";
import { getProperty } from "../../modules/parser";

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
  { label: "Email", key: "email" },
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
  const [progressId, setProgressId] = useState<string | null>(null);
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
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const [deleteAction, {}] = useDeleteInquiryMutation({
    variables: {
      input: { id: deleteId || "" },
    },
    onCompleted: () => {
      router.replace("/inquiries");
      enqueueSnackbar("問い合わせを削除しました", { variant: "success" });
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
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

  useEffect(() => {
    if (!data || !data.inquiry) return;

    setProgressId(data.inquiry.progress.id);
  }, [data]);

  return (
    <>
      <Container maxWidth="xl" sx={{ marginTop: 2 }}>
        <Box sx={{ marginBottom: 2, display: "flex" }}>
          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
            <Breads naked />
          </Box>
          <Box>
            <Button color="inherit" onClick={() => router.back()}>
              戻る
            </Button>
            <Button onClick={handleEdit} sx={{ marginRight: 1 }}>
              編集
            </Button>
            <Button onClick={handleDelete} color="error">
              削除
            </Button>
          </Box>
        </Box>
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, display: "flex", alignItems: "center" }}>
              <Typography variant="h5" component="h3" sx={{ flexGrow: 1 }}>
                進捗状況
              </Typography>
              {progressId ? (
                <>
                  <StaffSelector
                    progressId={progressId}
                    currentStaffId={
                      data?.inquiry ? String(data.inquiry.progress.staffId) : ""
                    }
                    refetchFunc={refetch}
                  />
                  <RankSelector
                    progressId={progressId}
                    currentRank={data?.inquiry?.progress.rank}
                    refetchFunc={refetch}
                  />
                  <StateChanger progressId={progressId} refetchFunc={refetch} />
                  <RecontactedOnPicker
                    progress={data?.inquiry?.progress}
                    refetchFunc={refetch}
                  />
                </>
              ) : null}
            </Paper>
          </Grid>
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
                        <Grid item xs={4} key={`label-${key}`}>
                          {label}
                        </Grid>
                        <Grid item xs={8} key={`value-${key}`}>
                          {getProperty(data.inquiry, key)}
                        </Grid>
                      </>
                    ))
                  : null}
                <Grid item xs={4} key={`label-menus`}>
                  問い合わせ項目
                </Grid>
                <Grid item xs={8} key={`value-menus`}>
                  {data?.inquiry
                    ? data.inquiry.menus.map(({ id, name }) => (
                        <Chip key={id} label={name} sx={{ m: 1, mt: 0 }} />
                      ))
                    : null}
                </Grid>
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
                        <Grid item xs={4} key={`label-${key}`}>
                          {label}
                        </Grid>
                        <Grid item xs={8} key={`value-${key}`}>
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
                          <Grid item xs={4} key={`label-${key}`}>
                            {label}
                          </Grid>
                          <Grid item xs={8} key={`value-${key}`}>
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
      <UserFormDialog
        open={userModalOpen}
        inquiry={data?.inquiry}
        userId={data?.inquiry?.userId ? String(data.inquiry.userId) : undefined}
        defaultSearchValue={(data?.inquiry && data.inquiry.email) || undefined}
        refetchFunc={refetch}
        onClose={() => setUserModalOpen(false)}
      />
      <CommentsDialog inquiryId={(id as string | undefined) || "0"} />
    </>
  );
};

export default InquiryShow;
