import { FC, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import { useSnackbar } from "notistack";
import {
  useGetStaffsListQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "../../../graphql/client";
import DataTable, { ColumnProps } from "../../../components/dataTable";
import FormDialog, {
  FormData,
  InputOption,
} from "../../../components/formDialog";
import DeleteDialog from "../../../components/deleteDialog";

interface Staff {
  id: string;
  name: string;
  email: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
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
      enqueueSnackbar(error.message, { variant: "error" });
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
      enqueueSnackbar(error.message, { variant: "error" });
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
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  useEffect(() => {
    if (!data) return;

    const records = data.staffsList.staffs.map<Staff>((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      icon: r.icon || someoneImageBinary,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
    setRows(records);
    setCount(data.staffsList.pageInfo.recordCount);
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
    <Container>
      <DataTable
        title="スタッフ一覧"
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        per={per}
        page={page}
        recordCount={count}
        onPerChange={handlePer}
        onPageChange={handlePage}
        onNewButtonClick={handleNew}
        onEditButtonClick={handleEdit}
        onDeleteButtonClick={handleDelete}
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

const someoneImageBinary =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMAAwICAgICAwICAgMDAwMEBgQEBAQECAYGBQYJCAoKCQgJCQoMDwwKCw4LCQkNEQ0ODxAQERAKDBITEhATDxAQEP/bAEMBAwMDBAMECAQECBALCQsQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEP/AABEIAgACAAMBIgACEQEDEQH/xAAdAAEAAgIDAQEAAAAAAAAAAAAACAkGBwMEBQIB/8QATBAAAQMDAgIFBgcNBwMFAAAAAAECAwQFBgcRCBIJITFBYRMUIlFxgRUjMkJicpIWMzhSU3SCkaGxsrTBFyRDY3OTojQ3dnWUs8LD/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALUwAAAAAAAAAAAAAAAAAAAAAAAAABgutGq9u0VwSo1BvNnrLjbqGogiqo6RzUmYyV6MR7UcqNd6bmJsqt6lVd+rZdPWbpD+HW58vntTkdo37fPLXzbe3yL5DN+MOzuvnDTndE1FVY6COs6vVBPHMv8A8ZUGBbhTcbHDBVJvHqpTt/1LbWx/xQockvGjwxQsWR+q1GqJ+JQVb1/UkSqVFgC0+99IJw22mJZKC/Xm8uTsZQ2mVjl/3/Jp+01hkvSeWCHmZh+lNwq9+pstyuLKfl8VZG2Tf2cye0r/AABKzIekf11uivZZLTi9liX5KxUck8qe10kitX7KGt75xh8SmQOctZqvdKdF7G0MUNIiJ6kWFjV/buabAGVXfVjVLIOb4d1Jym4o7tSqvFRKn6nPUx+S63Sb79cqp/1pnL/U6oA5oa2sppfL09XNFInz2SK1360Mht+qWpto2+CtRsoouXs83u9RHt9l6GMADdeJ8ZnEhiKxsptSq25QM23hu0Udbzp6lfI1ZP1ORTfOA9Jrdo5oqbU7Tylng2RJKuySujkRfX5GVzkd9tpBsAXMaV8Q+kWssKJg+XU01dy8z7bU/EVjPX8U7rcibdrOZPE2QUR0tVU0VRHV0VRLTzwuR8csT1Y9jk7FRU60XxJc6AdIFmOHS0uNavpNkdjRWxNuTU3uFK3f5Tl7J2p47P6vlL2AWRg8bEcxxfPLDTZPh18pLta6tN4qmmfzNVU7Wqna1yd7VRFTvQ9kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxDWC0Ov+kua2NibvuGPXGmZ1b+k+mkai/rVCk4vdmhiqIZKeZiOjlarHtXvaqbKhRZdbfNabpWWqo++0dRJTv+sxytX9qAdUAAAAAAAAAAAAAAAAAAerj+W5VidSlZi2S3WzzoqO8rQVklO7f2sVFNy4jxxcSGJ8sbs4beoG7fE3ekjqN/bIiNk/5mhQBP7T3pM7PUrHSao4BPRPVdnVtll8rH7VhkVHNT2PcvgSg021+0g1aa1mC5xb66rVqOWhkcsFU31/EyIj12261RFTxKYTkp6iopJ46qknkhmicj45I3K1zHJ2Kip1oviBe4CrXRvjy1g04kprXllV92NjjVrHRV7188jZ1J8XUfKVdk/wATm93aWA6OcQemGuNrSswq+s8+YxH1Vqqdo6ym+szf0k+k1Vb4gbJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB5WVZRY8Kxy45XktfHRWy107qmpnevU1jfV61VdkRO1VVETtKUM7vlBk+cZDktrpJKWiu11q66mgkVFfFFLM57GO26t0RyIu3qJRdIDxATZjmH9j+M3BVsWOyItzdE9eWqr07WO9bYuzbs51d+KhEEAAAAAAAAAAAAAAAAAAAAAAAAAd6x3y841dqW/Y/c6m3XGhkSanqqaRY5Inp2K1ydaHRAFkvCjxvUWplVRacarSQUGVTqkNBcWtSOmub+6NyJ1RTL3J1NevU3ZytY6XZRDHJJFI2WJ7mPYqOa5q7K1U7FRe5SzLgn4qqrV22u04zypa7K7RTJJT1jnIi3Smb1K5yd8zOrm/GRebtRwErAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANa8RWqUWj2j+Q5qkrW10VOtLbWr8+sl9CL28qrzr4MU2UV+dJhqMlZfsY0rop0WO3QuvNc1N/vsm8cKL4oxJF9kiAQlnnnqp5KmpmfNNM9ZJJJHK5z3Ku6uVV61VV69z4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAezhmX37AcqteZ4xWebXS0VLammk23TmTta5O9qpu1U70VUPGAF2Wkuo1p1Z07sef2dWtiu1K2SWJHIqwTp6MsS+LXo5Pdv3mXEAujU1SqIbtkGkFxq96apiW82xj1X0ZWq1k7G93pNVjtvoOXvJ+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACnHiizJ2d6/ZtfUlWSFl0koKde5YabaBip4KkfN+kW/ZDd4sfsFzv06bx22jmq3p62xsVy/uKNKuqnrqqatqpFkmqJHSyOXtc5y7qv61A4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbC4fM6m041oxDLY5VjiprnFDVbO2RaaVfJTIv6D3e9ELnih/s60LtNJcnkzTS7EssmfzTXay0VXMu+/xr4Wq9Pc7mQDLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa84h7i+1aD6g1sa7PbjdwY1fU58D2IvuV25TEXEcV0jouHPP3N7Vs8jfcqtRf3lO4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtt4JL0t74ZcNke5Vko46qif4eSqpWtT7HIVJFoPR1V/nnDx5vzb+Y32tp/Zu2KT/wDQCT4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANScWX4OOff+kv/AI2lPRcVxVQrUcOuoDE7rLM/7Ozv6FOoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAss6NL/sTff/AC2q/k6MrTLLejUYrdCL25fn5ZVKn/tKRP6ASzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABrriMp/OdA9RI9t9sYuUn2ad7v6FMhdJr7/ANidR/8AxK8fycpS2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALOOjgiWPQCteqbeVySrf7fiadP6FY5af0fdF5rw22ufl288uVfN7dpVZ/9AJIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwDiClbFoPqM569S4pdm+9aSRE/apS8W98YGT0OMcOuayVVbBDNcLctvp45JEa6Z8zmxq1iL1uVGvVdk7kVe4qEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFtvBFR+ZcL+ExqmzpI62ZfHnrZ3J+xUKki33hDuNjrOHnCqOzXeirX0Vsjjq2U87ZHU8zlVzo5Eau7XIqrui7KBuMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOpd7rQ2K1Vt7uk7YKO308lVUSu7GRRtVznL7ERVO2aj4tqispuG/PpKB/LI61LG5f8t0jGyJ72K5AKvtdtZ8k1y1ArsvvlTMlJ5R8VronO9Cipd/QjaidW6psrl73br6jXgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2FoZrTlGheeUeYY9UPfTK5sVzoVcvk62mVfSY5N0TmRN1a75rtl7N0XXoAvRsN7tuS2O35HZqhJ6C6UsVbSyp2PikYj2O96Kh3zVPCpUS1PDpgEkz+ZzbNDGi/RaqtanuREQ2sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAx7ULFoc4wPIsNna1WXu11NB6Xcskbmovhsqou/gZCAKJa2jqrdWT2+thdDUU0roZo3drHtVUc1fFFRUOE31xt6crp5xA319PT+ToMk5b5SqjOVu8yr5ZE7uqZsnuVDQoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5KWmqK2pho6SF0s88jYoo2pur3uXZETxVVOM3zwTab/2i6/2Naqn8rb8c5r5V7s5m/Eqnkmr3dczo+r1IoFoWmmLfcPp3jOHK1rXWW0UlDJyruivjia1y79+7kVfeZKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ96SbT2O9aaWXUWmgRarG6/wA1qHonX5rU7J1+yVsaJ9dSuEuv1iwmLUbSzKcJkjV7rta54YETunRvNEvukaxfcUovY6Nyse1WuaqoqKmyovqA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACx7o2dPY7LppetRamBEqskr/Nad6p1+a026dXtldIi/UQriYx0jkYxquc5dkRE3VV9Rddo7hMWnOlmLYTHGrHWm1wQzovfOreaVffI56+8DMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACm3iYwZ+neuuZY0kKx06XKSspEVOrzeo+OjRPWiNkRv6KlyRATpLdMJ4rnjurtBT7wTxfAtxc1F9GRqukgcvd6TVkbv9Bqd4EGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbO4Z8GfqJrrhuNLCslOtyjrKtETq83p/jpEX1IrY1b+khckQE6NLTCeW55Fq7X0+1PBF8C25zkX0pHK2Sdyd3otSNu/03J3E+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiWq2m1h1cwG76f5Gjm0l1h5GzMaivp5Wqjo5Wb97XIi+PWnYqmWgClPVrSPNdF8wqsPzS2SQSxPctLVNavm9dDv6M0L+xzVRU8Wru1yI5FRMLLu8902wXU+zLj+fYxRXqh35mMqGqjo3fjRvaqPYvi1UUhRxdcHWlulmk1ZqFp3RXWmqqGupmzxTVjp4W08jlYuyOTmRUe6PrVy94EGwAAAAAAAAAAAAAAAAAAAAAAAAAAM00l0jzXWjMKXD8Ltkk8sr2rVVTmr5vQw7+lNM/sa1ERfFy7NaiuVEWWHCLwdaW6p6TUeoWolFdamqrq6pbBFDWOghdTxuRibo1OZVV7ZOtHJ3E18C02wXTCzJj+A4xRWWh35nsp2qrpHfjSPcqvevi5VUDr6U6bWHSPAbRp/jiOdSWqHkdM9qI+olcquklft3ucqr4dSdiIZaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1/wAQGKfdvonmuMsYr5auy1LoGom+80bFkiT7bGmwD8c1rkVrkRUVNlRe9AKIAZXqxiD8A1NynC3MVrbPdqmli3+dC2RfJu9is5V95igAAAAAAAAAAAAAAAAAAAAAAAMr0nxB+f6m4thbWK5t4u1NSy7fNhdInlHexGcy+4C3Xh/xT7iNE8Kxl7FZLSWWmdO1U22mkYkkqfbe42AfjWtaiNaiIiJsiJ3IfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFX3SH4b9zuvi5DDCjYMntdPWq5E2RZo0WB6e3aKNV+sRgLJOkkwFL5pVZ89poUWoxi4pFM9G9aU1SiMXdfCVsP2lK2wAAAAAAAAAAAAAAAAAAAAAASf6PDDfui18TIZoUdBjFrqK1HKm6JNIiQMT27SyKn1SMBZJ0beApY9KrxntTCiVGT3FYoXq3rWmpkVibL4yum+ygEvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjuomFWzUbBr5g14ai0t6opaRzlT725yehIni13K5PFqFKeTY7dcRyK5YtfKZ1PcLTVS0dTG5FTlkY5Wrtv3dW6L3psXnEF+kE4b6iu59eMOomvfBE2LIqaJnpOY1NmVfV27N2a/1IjV7nKBAcAAAAAAAAAAAAAAAAAAAAB6WM47dcuyK24tY6Z1RcLtVRUdNG1FXmke5Gpvt3de6r3JuXWad4VbNOcGseDWdqJS2WiipGuRPvjmp6ci+Lnczl8XKQ56PvhvqKHk14zGiax88TosdppWek1jk2fV9fZu3drPWiuXvapOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8TQw1ET6eoiZLFK1WPY9qOa5qpsqKi9qKncfYArU4zOEKTS+qqNTtOKFz8Rqpeauoo03W0yuXZFT/Icq7IvzFVGr1K0iUW78Zn4MudfmlP8AzUJUQAAAAAAAAAAAAAAAAAJa8GfCFJqhVU+p2o9C5mI0svNQ0UibLdpWrsqr/kNVNlX56orU6kcRKLd+DP8ABlwX80qP5qYDc0MMNPEynp4mRRRNRjGMajWtaibIiInYiJ3H2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaW4zPwZc6/NKf+ahKiC3fjM/Blzr80p/5qEqIAAAAAAAAAAAAAAAAAFu/Bn+DLgv5pUfzUxUQW78Gf4MuC/mlR/NTAbpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABpbjM/Blzr80p/wCahKiC3fjM/Blzr80p/wCahKiAAAAAAAAAAAAAAAAABbvwZ/gy4L+aVH81MVEFu/Bn+DLgv5pUfzUwG6QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaH45KzzPhezLZdnT+YQt/SroN/2blS5Zb0keVNtOi1qxmOVEmv17i5mb9boII3vcu3fs9Yf1laQAAAAAAAAAAAAAAAAAtn4Gq3zzhfw3dd3Qefwu91dPt+xUKmCzLo38kjuuhtwsDpkWex3ydnk9+tsMsccjV29SuWX7KgSuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADjqKiCkgkqqqeOGGFjpJJJHI1rGom6uVV6kRE61VTBtVdc9MdGLYtwz3J4KSV7VdBQxfG1dR/pxJ6Spv85dmp3qhXLxHcZuc64NmxmyxyY5iLl2dQxS7z1qIu6LUPTtTsXyaeii9vMqIqB5HF/rvT666pPrrG9647YY3W61K7dPLtR6q+o2VEVvlF22RevlazfZd0NGgAAAAAAAAAAAAAAAAADevB/r9BoPqWtTfUcuN5AyOgurm7qtMiP3jqeVEVXeTVXboibq1ztt12Q0UAL2aGuornRQXG21kFXSVUbZoJ4JEkjljcm7Xtcm6OaqKioqdSopzlSfDxxcahaCSR2aNUvmKPl55rRUyKnkt13c6nk6/JKu6qqbK1V3VU3Xcsd0a4jNLdcre2XDr6yO5NYjqi0VipFWQrtuvob+m1PxmK5vigGzwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGO5vqHhGm1ndfs6yegstE3flkqpdnSKnzWMTdz3dfY1FXwISa19I7X1iT2LRCzrRxLuxb3cokdKvjDAu7W+Cv3+qgE0NRdVtPdJ7Ot7z/KaK0wKi+SZI/eadUTfljibu969XzUUg3rZ0i+UX/wA4sWjNrdYaF3NGt2rGtkrZE603jj62Rbpt1rzO+qpETJsqyTM7xPkGWXytu1xqF3kqauZ0j1699t17ETfqROpO48sDu3m93jIrnUXm/wB0q7jX1T1fPU1UzpZZHL3uc5VVTpAAAAAAAAAAAAAAAAAAAAAAAA7FvuNwtNbDcrVXVFHV07kfDUU8ro5I3J2K1zVRUXxQ64AmVoX0iGU415vj2s1FLkFuRUY270yNbXQpuibyN6mzIid/ou8XKTxwHUjB9ULFHkeCZHR3eheiczoX+nE5fmyMXZ0bvByIpSIe/hGf5npve48iwbI62zXCL/FppNken4r2r6L2/Rcip4AXgghJoh0jNmunm9g1utaWupXZiXugjV1M9d0TeaFN3R+tXM5k+i1CZVgyKw5XaYL7jN5o7pbqpqOhqqSZssb08HNVU93cB6IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA83IcksGJWiov8Ak95o7XbqVqvmqauZscbE9q9/qTtXuIU65dI1T0r6jH9DbYype1VY6/XCJfJou/bBAvW7v2dJt9VQJhZ7qVgmmFnW+55lFDZqTr5FqJPTlVPmxsTd0jvBqKpCnWXpIrhVeXs2idg8zj62fDN0jR0q+MUHW1vgr1d9VCG2X5tluf3qXIs0yKuvNxm6nT1cqvVE7mtTsa1O5qIiJ6jxAPZy3NMszy8SX/Msir7zcJflT1kyyORPxW79TW+pE2RPUeMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMy001h1H0huyXfAMpq7Y5zkdNTo7np6hE26pInbsd2bbqm6dyoYaALHNFOkSwvKEp7Hq9b24zcnbM+EqdHSUErvW5Ot8O6+vmb63IS6tl0tl6oILrZrjTV1FUs54ammlbLFI31tc1VRU9hRSbD0k191S0UuHneC5JLDSvfzz22o3lo6j68Srsi9fym8rvEC50EYtDePLTHUzzex5s6PD8gkVGI2pl3oah6qiJ5OZduRVVfkv29SOcSbY9krGyRva9j0RzXNXdFRexUUD6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPOyDIbHillrMjyS6U1ttlviWapqqh6MjiYneqr47IidqqqInWoHokcuIPjX070a85x7H3R5PlUe7Fo6eX+70j9v8AHlTqRUX5jd3dy8vaRq4kuPXIc6Sqw7R+SpsePva6Goua7sra1q9S8nfAxU9Xprv1q3raRBc5znK5yqqqu6qvaqgZzqtrZqRrReVvGe5DNVox29PRR7x0lMnZtHEi7N6vnLu5e9VMGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbv0N4u9V9EXwW2kuC33HI1RHWe4SK5jG+qGTrdD7E3b62qaQAFw2iHE3pdrtRtjxm6+Z3trOaos1aqMqmbJu5WJ2SsT8Zu/iidhtoont1xuForoLnaq6oo6ymekkNRTyLHJG9OxzXN2VF8UJ3cNvSBRVHmuGa8Ttik2ZDTZExmzXr2IlU1Pk/6jU2/GROtwE6gcdPUU9XTxVdJPHNBMxskckbkcx7FTdHNVOpUVF3RUOQAAAAAAAAAAAAAAAAAAAAAAAAAAeDnWcYzpvilxzTL7kyhtdsiWWaR3a5exrGJ857lVGtanWqqiAdXUnUnENJ8Qrc2za5to7dRpsiJsss8qovLDE3f05HbLsngqqqIiqlVHEPxN51xAXxXXOZ9sxylkV1vssMqrFH3JJKvV5WXb5ypsm6o1ERV36fELxCZbxA5g69Xl7qOz0bnstFpY/eOkiVe1fx5XbIrn9+yImzURE1UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASR4X+MfKNFKumxXLJKm9YS93ItOq809uRV6306qvW3tVY16l7uVd97OsXynHs1sFFlGK3anudquESS01TA7dr2/vRUXdFauyoqKioioUaG6+Gjidyrh8yNGIs1zxOvlRbpaef2J5eDfqZKiexHonK7sa5oW6g8vGMmsWZY/b8qxi5RXC1XSBtTS1MSryyMcnV1L1oqditVEVFRUVEVFQ9QAAAAAAAAAAAAAAAAAAAAAA4554KWCSqqpo4YYWLJJJI5GtY1E3VyqvUiInWqlUnF5xM3DXfLlstmkdBh1hqHtt0KL/1cqbtWrk8VTdGJ81qr3ucSS6QfiDfi9gZopi9Xy3O+wJNepWdsNEq+jDv3OkVF3+gm3zyuwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJQ8FXFDPpFkkeAZlcJHYbep0ax8i7ttlS5dklT1RuXZHp2J8rudzWfNc17UexyOa5N0VF3RUKICyTgH4jX57ja6RZdWvkv8Aj1Pz26oleirWULdkRnX1q+LdE8WK1fmuUCXgAAAAAAAAAAAAAAAAAAHgZ7mll06wy8ZxkM3k7fZqR9VLt2v2+Sxv0nOVrU8XIe+Qa6SvVPze3Y/o/bapEfVu+Gbo1rk38m1VZAxfBXeUdt9BqgQl1Bzi9ak5rec6yGXnr7zVPqZE33SNF6mRt+i1qNang1DHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGSacZ5fNMc4s+d47KrK6z1TZ2t32bKzsfG76L2q5q+DlMbAF4WB5pZdRMOs+b49N5W33mlZVQqva3dPSY76TXIrV8Wqe8Qb6NPVLzm15DpDcqreSjf8M2xrnJv5J6oydieCO8m7b6blJyAAAAAAAAAAAAAAAAAfjnNY1XvcjWtTdVVdkRPWUv696j1GrGruTZvJKr6esrXx0Sc26MpI/QhRP0GtVfFVXvLTuKHOv7OtBcxyOOVI6p1vdQUi79aT1CpCxU8WrJzfoqU5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbE4fNSJ9KNYsYzRkvJTU9ayCuTm2R1JL8XMi+xrlcni1C5tFRU3Rd0UogLluG/N/wC0PQzDMpfKklRNa46aqdvuq1EG8Mqr7XxuX3gbKAAAAAAAAAAAAAAABDXpNMldQ6b4niccqtW7XiSse1F252U8KtVF9ac1Q1faiFdJMPpMcj891SxjF2SczLVY1qnJv1NkqJnoqe3lgYvvQh4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALIujUyhblpJkGLSyq+SyXtZmNVfkQ1ETVan245V96lbpMjozMm8x1KyvEnycrLvZo61qKvU6SmmRqJ7eWoevuUCxgAAAAAAAAAAAAAAAEKOPLhfyfN65msuAUs9zq6WjZS3a1xNV8zoo+blnhb2uVEXlcxOvZEVEX0iviSOSKR0UrHMexVa5rk2Vqp2oqdyl7xpnV3hJ0V1jlqbnfMc+DL3Uqrn3a1uSCoe/bbmkTZWSr2db2qvV2oBUKCX2ovRuan2FZavTvI7Zk9M1VVlPP/cqvbuREcqxu9vO32Ebsz0k1O08kczNcDvdna3/ABqmjekLvqyonI73KoGJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADLcM0k1O1DkazCsDvd4a7/GpqN6wt+tKqcjfeqEkdOujc1PvyxVeomR2zGKZyor6eD++1e3eio1Ujb7ed3sAiHHHJLI2KJjnveqNa1qbq5V7ERO9SwfgN4X8nwiufrLn9LPbKuqo30tptcrVZM2KTlV08ze1qqicrWL17Kqqieibx0i4SdFdHJaa52PHPhO90yo5l2ujknqGP225o02RkS9vWxqL19qm5gAAAAAAAAAAAAAAAAAAAHy9jJGOjkYjmuRUc1U3RUXuU+gBrPLuGnQXOVkkyPSuwSTS/LnpafzSZy+tZIFY9V8VU0tlnRt6MXdXzYvkORY/K75MflmVcDf0XtR6/7hLUAV4ZJ0Y+eUvM7EdS7FckTra24Us1Gq+HoeVTc1ZkPArxLWBXOiwaG7Qs7ZbdcqeTf2Mc9r1+yWxAClLINFtXsV5lyLTHKKBjO2Wa1TpF7n8vKvuUw1zXMcrHtVrmrsqKmyovqL3zy7xi2MZC1WX/ABy13NqpsqVlHHMip+migUZguQvXC/w9X/m8/wBH8ZYru1aSibSKvvh5VMIufAPwzXDdabDq+3K7vpbvUrt7pHvQCqYFllz6NbQ+q3dbsmzGhcvYnndPIxPc6Hf/AJGJ3PowMfl3+BtX7hTepKm0Mn/hlYBX+Calz6MTN4t/gbVKx1Xq86oZoN/srIYpX9G/r7SOVKW64fWt7lhuEzV/U+FoEVgSOquj+4lKffyOOWmq2/JXaFN/tq08eq4HeKGk3VdMXStTviu1C/8AYk2/7ANEg29VcI3EjR7+W0jvTtvyXkpf4HqePVcOOv1Hv5bRnMnbfkrNPL/A1QNcgy+o0d1dpFVtVpZl8Kp3SWOqb+9h0pdONQ4Pv2B5FH9a1zp+9oGOg9eXD8tg+/Ytd4/rUMqfvadV9jvcf3yz1zfbTvT+gHSB2HW64M+XQ1DfbE5P6HC6GVny4nt9rVQD5B9Nhlf8iJ7vY1VOZtuuD/kUNQ72ROX+gHXB3WWO9yfe7PXO9lO9f6Haiw/LZ/vOLXeT6tDKv7mgeQDIotONQ5/vOB5FJ9W1zr+5p3afR3V2rVG0ulmXzKvdHY6p37mAYgDY1Lw46/Vm3kdGcybv+Vs08X8bUPYpeEbiRrNvI6R3pu/5XyUX8b0A1CDe1LwO8UNXsqaYuiavfLdqFn7Fm3/YexS9H9xKVG3lsctNLv8AlbtCu32FcBHEEqaDo39fatyJVXXD6Jves1wmcv6mQuMrtnRiZvLt8M6pWOl9fmtDNPt9pYwIVgsAtnRgY/Ft8M6v3Cp9aU1oZB/FK8yy2dGtofS7OuOTZjXOTtTzunjYvubDv/yArTBazbOAfhmt+y1OHV9xVvfVXepTf3RvYhm9l4X+HqwcvmGj+MvVvYtXRNq1T3zcygU4Na57kYxquc5dkRE3VV9RmWP6LavZVyrjumOUV7H9ksNqnWL3v5eVPepczZ8WxjHmoywY5a7Y1E2RKOjjhRE/QRD1AKnce4FeJa/q10uDQ2mF/ZLcblTx7e1jXuen2TaeN9GPnlVyuy7UuxW1F63Nt9LNWKnh6fkk3LDwBErE+jb0YtCsmyjIciyCVvyo/LMpIHfosar0/wBw3TiPDToLgyxyY5pXYI5ovkT1VP53M1fWkk6vei+KKbMAHyxjI2NjjYjWtREa1E2RETuQ+gAAAAAAAAAAAA//2Q==";
