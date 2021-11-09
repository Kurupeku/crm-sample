import { FC, useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import Container from "@mui/material/Container";
import { useRecoilValue } from "recoil";
import { currentStaffState } from "../../modules/atoms";
import {
  useGetStaffsListQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "../../graphql/client";
import DataTable, { ColumnProps } from "../../components/dataTable";
import FormDialog, { FormData, InputOption } from "../../components/formDialog";
import DeleteDialog from "../../components/deleteDialog";
import Breads from "../../components/breadcrumbs";
import someoneAvatar from "../../modules/avatar";

interface Staff {
  id: string;
  name: string;
  email: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
}

const columns: ColumnProps[] = [
  { key: "id", label: "ID", type: "string" },
  { key: "icon", label: "", type: "avatar" },
  { key: "name", label: "名前", type: "string" },
  { key: "email", label: "Email", type: "string" },
  { key: "createdAt", label: "作成日時", type: "datetime" },
  { key: "updatedAt", label: "更新日時", type: "datetime" },
];

const newInputOptions: InputOption[] = [
  { name: "name", label: "名前", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "パスワード", type: "password", required: true },
];
const editInputOptions: InputOption[] = [
  { name: "name", label: "名前", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
];

const StaffsIndex: FC = () => {
  const [rows, setRows] = useState<Staff[]>([]);
  const [count, setCount] = useState(0);
  const [per, setPer] = useState(25);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const currentStaff = useRecoilValue(currentStaffState);
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading, error, refetch } = useGetStaffsListQuery({
    variables: { per, page },
  });

  const [createAction, {}] = useCreateStaffMutation({
    variables: {
      input: {
        name: (form?.name as string) || "",
        email: (form?.email as string) || "",
        password: (form?.password as string) || "",
      },
    },
    onCompleted: () => {
      setForm(null);
      refetch();
      enqueueSnackbar("スタッフを作成しました", { variant: "success" });
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
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
      enqueueSnackbar("スタッフを作成しました", { variant: "success" });
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
      setDeleteId(null);
      refetch();
      enqueueSnackbar("スタッフを削除しました", { variant: "success" });
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  useEffect(() => {
    if (!data) return;

    const records = data.staffsList.staffs.map<Staff>((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      icon: r.icon || someoneAvatar,
      createdAt: parseInt(r.createdAt, 10),
      updatedAt: parseInt(r.updatedAt, 10),
    }));
    setRows(records);
    setCount(data.staffsList.pageInfo.recordsCount);
  }, [data]);

  const handlePer = (per: number) => {
    setPer(per);
    setPage(1);
  };

  const handlePage = (page: number) => setPage(page);

  const handleNew = () =>
    setForm({ id: null, name: "", email: "", password: "" });

  const handleEdit = (id: string) => {
    const target = rows.find((row) => row.id === id);

    if (target) setForm({ id, name: target.name, email: target.email });
  };

  const handleFormChange = (key: string, value: unknown) => {
    if (!form) return;

    const newForm = { ...form, [key]: value as string };
    setForm(newForm);
  };

  const handleDelete = (id: string) => setDeleteId(id);

  return (
    <Container sx={{ marginTop: 2 }}>
      <Breads />
      <DataTable
        title="スタッフ一覧"
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        per={per}
        page={page}
        perOptions={[5, 10, 25]}
        recordCount={count}
        onPerChange={handlePer}
        onPageChange={handlePage}
        onNewButtonClick={handleNew}
        onEditButtonClick={handleEdit}
        onDeleteButtonClick={handleDelete}
        editableOwnedOnly
        ownerId={currentStaff?.id || undefined}
      />
      <FormDialog
        data={form}
        options={form?.id ? editInputOptions : newInputOptions}
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

export default StaffsIndex;
