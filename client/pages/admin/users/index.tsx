import { FC, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { useSnackbar } from "notistack";
import {
  useGetUsersListQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../../graphql/client";
import DataTable, { ColumnProps } from "../../../components/dataTable";
import FormDialog, {
  FormData,
  InputOption,
} from "../../../components/formDialog";
import DeleteDialog from "../../../components/deleteDialog";
import Breads from "../../../components/breadcrumbs";

interface User {
  id: string;
  companyName?: string;
  name: string;
  email: string;
  tel: string;
  createdAt: number;
  updatedAt: number;
  address: {
    postalCode: string;
    prefecture: string;
    city: string;
    street: string;
    building: string;
  };
}

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

const columns: ColumnProps[] = [
  { key: "id", label: "ID", type: "string" },
  { key: "companyName", label: "会社名", type: "string" },
  { key: "name", label: "顧客名", type: "string" },
  { key: "email", label: "Email", type: "string" },
  { key: "tel", label: "TEL", type: "string" },
  { key: "createdAt", label: "作成日時", type: "datetime" },
  { key: "updatedAt", label: "更新日時", type: "datetime" },
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

const UsersIndex: FC = () => {
  const [rows, setRows] = useState<User[]>([]);
  const [count, setCount] = useState(0);
  const [fieldsCont, setFieldsCont] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [per, setPer] = useState(25);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading, error, refetch } = useGetUsersListQuery({
    variables: { per, page, fieldsCont, order: `${orderBy} ${order}` },
  });

  const [createAction, {}] = useCreateUserMutation({
    variables: {
      input: {
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
      enqueueSnackbar("ユーザーを登録しました", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
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
      enqueueSnackbar("ユーザー情報を更新しました", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  const [deleteAction, {}] = useDeleteUserMutation({
    variables: {
      input: { id: deleteId || "" },
    },
    onCompleted: () => {
      setDeleteId(null);
      refetch();
      enqueueSnackbar("スタッフを削除しました", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  useEffect(() => {
    if (!data) return;

    const records = data.usersList.users.map<User>((r) => ({
      id: r.id,
      companyName: r.companyName || "",
      name: r.name,
      email: r.email,
      tel: r.tel,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      address: {
        postalCode: r.address.postalCode,
        prefecture: r.address.prefecture,
        city: r.address.city,
        street: r.address.street,
        building: r.address.building || "",
      },
    }));
    setRows(records);
    setCount(data.usersList.pageInfo.recordsCount);
  }, [data]);

  const handlePer = (per: number) => {
    setPer(per);
    setPage(1);
  };

  const handlePage = (page: number) => setPage(page);

  const handleOrder = (newOrderBy: string, newOrder: "asc" | "desc") => {
    setOrderBy(newOrderBy);
    setOrder(newOrder);
  };

  const handleSearch = (value: string) => setFieldsCont(value);

  const handleNew = () =>
    setForm({
      id: null,
      companyName: "",
      name: "",
      email: "",
      tel: "",
      postalCode: "",
      prefecture: "",
      city: "",
      street: "",
      building: "",
    });

  const handleEdit = (id: string) => {
    const target = rows.find((row) => row.id === id);

    if (target)
      setForm({
        id,
        companyName: target.companyName || "",
        name: target.name,
        email: target.email,
        tel: target.tel,
        postalCode: target.address.postalCode,
        prefecture: target.address.prefecture,
        city: target.address.city,
        street: target.address.street,
        building: target.address.building,
      });
  };

  const handleFormChange = (key: string, value: unknown) => {
    if (!form) return;

    const newForm = { ...form, [key]: value as string };
    setForm(newForm);
  };

  const handleDelete = (id: string) => setDeleteId(id);

  return (
    <Container>
      <Breads />
      <DataTable
        title="スタッフ一覧"
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        per={per}
        page={page}
        recordCount={count}
        orderBy={orderBy}
        order={order}
        searchLabel="検索"
        onOrderClick={handleOrder}
        onSearchSubmit={handleSearch}
        onPerChange={handlePer}
        onPageChange={handlePage}
        onNewButtonClick={handleNew}
        onEditButtonClick={handleEdit}
        onDeleteButtonClick={handleDelete}
      />
      <FormDialog
        data={form}
        options={inputOptions}
        onChange={handleFormChange}
        onSubmit={() => (form?.id ? updateAction() : createAction())}
        onCancel={() => setForm(null)}
      />
      <DeleteDialog
        id={deleteId}
        displayKey="name"
        data={rows}
        onSubmit={deleteAction}
        onCancel={() => setDeleteId(null)}
      />
    </Container>
  );
};

export default UsersIndex;
