import { FC, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbar } from "notistack";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../../graphql/client";
import ShowPanel, { Section } from "../../../components/showPanel";
import Breads from "../../../components/breadcrumbs";
import FormDialog, {
  FormData,
  InputOption,
} from "../../../components/formDialog";
import DeleteDialog from "../../../components/deleteDialog";

const prefsChoices = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
].map((v) => ({ label: v, value: v }));

const sections: Section[] = [
  {
    title: "ユーザー情報",
    layouts: [
      { name: "id", label: "ID" },
      { name: "companyName", label: "会社名" },
      { name: "name", label: "顧客名" },
      { name: "email", label: "Email" },
      { name: "tel", label: "TEL" },
      { name: "createdAt", label: "作成日時", type: "datetime" },
      { name: "updatedAt", label: "更新日時", type: "datetime" },
    ],
  },
  {
    title: "住所",
    layouts: [
      { name: "address.postalCode", label: "郵便番号" },
      { name: "address.prefecture", label: "都道府県" },
      { name: "address.city", label: "市区町村" },
      { name: "address.street", label: "町名番地" },
      { name: "address.building", label: "建物名・番地" },
      { name: "address.createdAt", label: "作成日時", type: "datetime" },
      { name: "address.updatedAt", label: "更新日時", type: "datetime" },
    ],
  },
];

const inputOptions: InputOption[] = [
  { name: "companyName", label: "会社名", type: "text" },
  { name: "name", label: "顧客名", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "tel", label: "TEL", type: "text", required: true },
  { name: "postalCode", label: "郵便番号", type: "text", required: true },
  {
    name: "prefecture",
    label: "都道府県",
    type: "select",
    required: true,
    choices: prefsChoices,
  },
  { name: "city", label: "市区町村", type: "text", required: true },
  { name: "street", label: "住所", type: "text", required: true },
  { name: "building", label: "建物名・号室", type: "text" },
];

const UserShow: FC = (props) => {
  const [form, setForm] = useState<FormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = router.query;

  const { data, refetch } = useGetUserByIdQuery({
    skip: !id,
    variables: { userId: parseInt(id as string) },
  });

  const [updateAction, {}] = useUpdateUserMutation({
    variables: {
      input: {
        id: (form?.id as string) || "",
        companyName: (form?.companyName as string) || "",
        name: (form?.name as string) || "",
        email: (form?.email as string) || "",
        tel: (form?.tel as string) || "",
        address: {
          postalCode: (form?.postalCode as string) || "",
          prefecture: (form?.prefecture as string) || "",
          city: (form?.city as string) || "",
          street: (form?.street as string) || "",
          building: (form?.building as string) || "",
        },
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

  const [deleteAction, {}] = useDeleteUserMutation({
    variables: {
      input: { id: deleteId || "" },
    },
    onCompleted: () => {
      router.replace("/admin/users");
      enqueueSnackbar("スタッフを削除しました", { variant: "success" });
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const handleEdit = () => {
    const target = data?.user;

    if (target)
      setForm({
        id: id as string,
        companyName: target.companyName || "",
        name: target.name,
        email: target.email,
        tel: target.tel,
        postalCode: target.address.postalCode,
        prefecture: target.address.prefecture,
        city: target.address.city,
        street: target.address.street,
        building: target.address.building || "",
      });
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
        <ShowPanel
          maxColumn={2}
          data={data?.user || {}}
          sections={sections}
          naked
        />
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

export default UserShow;
