import { FC, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { currentStaffState } from "../../modules/atoms";
import Link from "next/link";
import { useSnackbar } from "notistack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import {
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useUploadStaffIconMutation,
  useDeleteStaffIconMutation,
} from "../../graphql/client";
import ShowPanel, { Section } from "../../components/showPanel";
import Breads from "../../components/breadcrumbs";
import FormDialog, { FormData, InputOption } from "../../components/formDialog";
import DeleteDialog from "../../components/deleteDialog";
import someoneAvatar from "../../modules/avatar";
import ChangePasswordDialog from "../../components/staffPasswordDialog";

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
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const currentStaff = useRecoilValue(currentStaffState);
  const { id } = router.query;

  const { data, loading, error, refetch } = useGetStaffByIdQuery({
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
      router.replace("/staffs");
      enqueueSnackbar("スタッフを削除しました", { variant: "success" });
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const [uploadIconAction, {}] = useUploadStaffIconMutation({
    onCompleted: () => {
      enqueueSnackbar("画像をアップロードしました", { variant: "success" });
      refetch();
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const [deleteIconAction, {}] = useDeleteStaffIconMutation({
    variables: {
      input: {
        id: id as string,
      },
    },
    onCompleted: () => {
      enqueueSnackbar("画像を削除しました", { variant: "success" });
      refetch();
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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        if (reader.result)
          uploadIconAction({
            variables: {
              input: {
                id: id as string,
                icon: reader.result as string,
              },
            },
          });
      };
      reader.onerror = function (error) {
        enqueueSnackbar("ファイルを読み込めませんでした", { variant: "error" });
      };
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 2 }}>
      <Box sx={{ marginBottom: 2, display: "flex" }}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Breads naked />
        </Box>
        {currentStaff?.id === id ? (
          <Box>
            <Button onClick={handleEdit} sx={{ marginRight: 1 }}>
              編集
            </Button>
            <Button onClick={handleDelete} color="error">
              削除
            </Button>
          </Box>
        ) : null}
      </Box>
      <Paper sx={{ py: 4, px: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar src={data?.staff.icon || someoneAvatar} />
              {currentStaff?.id === id ? (
                <>
                  <ButtonGroup sx={{ mt: 3 }}>
                    <Button
                      onClick={() => fileRef.current?.click()}
                      sx={{ width: 80 }}
                    >
                      変更
                    </Button>
                    {data?.staff.icon ? (
                      <Button
                        onClick={() => deleteIconAction()}
                        sx={{ width: 80 }}
                      >
                        削除
                      </Button>
                    ) : null}
                  </ButtonGroup>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 3, width: 160 }}
                    onClick={() => setChangePasswordOpen(true)}
                  >
                    パスワード変更
                  </Button>
                  <input
                    ref={fileRef}
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFile}
                  />
                </>
              ) : null}
            </Box>
          </Grid>
          <Grid item xs={12} md={9}>
            <ShowPanel data={data?.staff || {}} sections={sections} naked />
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "end", marginTop: 2 }}>
        <Link href="/staffs" passHref>
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
      <ChangePasswordDialog
        open={changePasswordOpen}
        staffId={data?.staff.id || "0"}
        onClose={() => setChangePasswordOpen(false)}
        refetchFunc={refetch}
      />
    </Container>
  );
};

export default StaffShow;
