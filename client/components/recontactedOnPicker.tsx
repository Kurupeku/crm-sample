import { FC } from "react";
import { useSnackbar } from "notistack";
import format from "date-fns/format";
import ja from "date-fns/locale/ja";
import TextField from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import { useChangeProgressRecontactedOnMutation } from "../graphql/client";

interface Props {
  progress?: {
    id: string;
    state?: string | null;
    recontactedOn?: string | null;
  };
  refetchFunc: () => void;
}

const RecontactedOnPicker: FC<Props> = ({ progress, refetchFunc }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [updateAction, {}] = useChangeProgressRecontactedOnMutation({
    onCompleted: () => {
      enqueueSnackbar("再連絡日を設定しました", { variant: "success" });
      refetchFunc();
    },
    onError: (error) =>
      enqueueSnackbar("再連絡日の設定に失敗しました", { variant: "error" }),
  });

  if (!progress || progress.state !== "waiting_recontact") return null;

  const handleRecontactedOn = (newValue: Date | null) => {
    let dateStr = "";
    if (newValue)
      dateStr = format(newValue, "yyyy-MM-dd", {
        locale: ja,
      });

    updateAction({
      variables: { input: { id: progress.id, recontactedOn: dateStr } },
    });
  };

  return (
    <DatePicker
      label="再連絡日"
      value={
        progress.recontactedOn ? new Date(progress.recontactedOn) : new Date()
      }
      minDate={new Date()}
      mask="____/__/__"
      onChange={handleRecontactedOn}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          sx={{ minWidth: "80px", marginLeft: 2 }}
        />
      )}
    />
  );
};

export default RecontactedOnPicker;
