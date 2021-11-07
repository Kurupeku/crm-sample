import { FC, useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
  useGetInquiriesListQuery,
  useCreateInquiryMutation,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
  ProgressStateEnum,
} from "../graphql/client";
import DataTable, { ColumnProps } from "./dataTable";
import InquiryFormDialog, { FormData, RankMap } from "./inquiryFormDialog";
import DeleteDialog from "./deleteDialog";

interface Inquiry {
  id: string;
  userId?: number | null;
  companyName?: string | null;
  name: string;
  email: string;
  tel: string;
  numberOfUsers: number;
  introductoryTerm: string;
  detail?: string | null;
  createdAt: number;
  updatedAt: number;
  menuIds: number[];
  progress: {
    id: string;
    staffId?: number | null;
    rank: string;
    rankI18n: string;
    state?: string | null;
    stateI18n?: string | null;
    recontactedOn?: string | null;
    contactedAt?: number | null;
    staff?: {
      name: string;
    } | null;
  };
}

interface Props {
  state?: ProgressStateEnum;
  staffId?: number;
  title?: string;
}

const columns: ColumnProps[] = [
  { key: "id", label: "ID", type: "string" },
  { key: "companyName", label: "会社名", type: "string" },
  { key: "name", label: "顧客名", type: "string" },
  {
    key: "progress.staff.name",
    label: "担当スタッフ",
    type: "string",
    disableSort: true,
  },
  {
    key: "progress.rankI18n",
    orderKey: "progresses.rank",
    label: "見込みランク",
    type: "string",
  },
  {
    key: "progress.stateI18n",
    orderKey: "progresses.state",
    label: "ステータス",
    type: "string",
  },
  { key: "numberOfUsers", label: "利用想定人数", type: "integer" },
  { key: "introductoryTerm", label: "導入時期", type: "string" },
  { key: "createdAt", label: "作成日時", type: "datetime" },
];

const InquiriesIndexBase: FC<Props> = ({ state, staffId, title }) => {
  const [rows, setRows] = useState<Inquiry[]>([]);
  const [count, setCount] = useState(0);
  const [fieldsCont, setFieldsCont] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [per, setPer] = useState(25);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading, error, refetch } = useGetInquiriesListQuery({
    variables: {
      per,
      page,
      fieldsCont,
      order: `${orderBy} ${order}`,
      state,
      staffId: staffId || undefined,
    },
  });

  const [createAction, {}] = useCreateInquiryMutation({
    variables: {
      input: {
        companyName: form?.companyName || "",
        name: form?.name || "",
        email: form?.email || "",
        tel: form?.tel || "",
        introductoryTerm: form?.introductoryTerm || "",
        numberOfUsers: form?.numberOfUsers || 0,
        menuIds: form?.menuIds || [],
        detail: form?.detail || "",
        progress: {
          staffId: form?.staffId,
          rank: form?.rank || 0,
        },
      },
    },
    onCompleted: () => {
      setForm(null);
      refetch();
      enqueueSnackbar("問い合わせを作成しました", { variant: "success" });
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
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
      setDeleteId(null);
      refetch();
      enqueueSnackbar("問い合わせを削除しました", { variant: "success" });
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  useEffect(() => {
    if (!data) return;

    const records = data.inquiriesList.inquiries.map<Inquiry>((r) => ({
      id: r.id,
      userId: r.userId,
      companyName: r.companyName,
      name: r.name,
      email: r.email,
      tel: r.tel,
      numberOfUsers: r.numberOfUsers,
      introductoryTerm: r.introductoryTerm,
      detail: r.detail,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      menuIds: r.menus.map((r) => parseInt(r.id, 10)),
      progress: {
        id: r.progress.id,
        staffId: r.progress.staffId,
        rank: r.progress.rank,
        rankI18n: r.progress.rankI18n,
        state: r.progress.state,
        stateI18n: r.progress.stateI18n,
        recontactedOn: r.progress.recontactedOn,
        contactedAt: r.progress.contactedAt,
        staff: r.progress.staff ? { name: r.progress.staff.name } : null,
      },
    }));
    setRows(records);
    setCount(data.inquiriesList.pageInfo.recordsCount);
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
      detail: "",
      email: "",
      introductoryTerm: "",
      menuIds: [],
      name: "",
      numberOfUsers: 0,
      tel: "",
      staffId: null,
      rank: 0,
    });

  const handleEdit = (id: string) => {
    const target = rows.find((row) => row.id === id);

    if (target)
      setForm({
        id: target.id,
        companyName: target.companyName || "",
        name: target.name,
        detail: target.detail || "",
        email: target.email,
        introductoryTerm: target.introductoryTerm,
        menuIds: target.menuIds,
        numberOfUsers: target.numberOfUsers,
        tel: target.tel,
        staffId: target.progress.staffId || null,
        rank: target.progress ? RankMap[target.progress.rank.toLowerCase()] : 0,
      });
  };

  const handleFormChange = (key: string, value: unknown) => {
    if (!form) return;

    let newForm;
    if (key === "menuIds") newForm = { ...form, [key]: value as number[] };
    else newForm = { ...form, [key]: value as string };
    setForm(newForm);
  };

  const handleDelete = (id: string) => setDeleteId(id);

  return (
    <>
      <DataTable
        title={title || "問い合わせ一覧"}
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        per={per}
        page={page}
        orderBy={orderBy}
        order={order}
        searchLabel="検索"
        naked
        onOrderClick={handleOrder}
        onSearchSubmit={handleSearch}
        recordCount={count}
        onPerChange={handlePer}
        onPageChange={handlePage}
        onNewButtonClick={handleNew}
        onEditButtonClick={handleEdit}
        onDeleteButtonClick={handleDelete}
      />
      <InquiryFormDialog
        data={form}
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
    </>
  );
};

export default InquiriesIndexBase;
