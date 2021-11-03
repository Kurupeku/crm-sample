import { FC, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

interface Record {
  id: string;
  [key: string]: any;
}

interface Props {
  id: string | null;
  data: Record[];
  displayKey?: string;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

const DeleteDialog: FC<Props> = (props) => {
  const [target, setTarget] = useState<Record | null>(null);
  const { id, displayKey, data, submitLabel, cancelLabel, onSubmit, onCancel } =
    props;

  useEffect(() => {
    const newTarget = data.find((d) => d.id === id);
    if (newTarget) setTarget(newTarget);
  }, [id, data]);

  return (
    <Dialog open={!!id} onClose={onCancel}>
      <DialogContent>
        <DialogContentText>
          {displayKey && target && target[displayKey]
            ? `${target[displayKey]}を削除しますか？`
            : "削除しますか？"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel || "キャンセル"}</Button>
        <Button onClick={onSubmit} color="error">
          {submitLabel || "削除"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
