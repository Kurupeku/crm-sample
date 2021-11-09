import { FC, useState } from "react";
import { useSnackbar } from "notistack";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useChangeStaffPasswordMutation } from "../graphql/client";

interface Props {
  open: boolean;
  staffId: string;
  onClose?: () => void;
  refetchFunc?: () => void;
}

const ChangePasswordDialog: FC<Props> = ({
  open,
  staffId,
  onClose,
  refetchFunc,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [changeAction, {}] = useChangeStaffPasswordMutation({
    variables: {
      input: {
        id: staffId,
        password,
        newPassword,
      },
    },
    onCompleted: () => {
      enqueueSnackbar("パスワードを変更しました", { variant: "success" });
      setPassword("");
      setNewPassword("");
      refetchFunc && refetchFunc();
      onClose && onClose();
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  return !staffId ? null : (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ width: 350 }}>パスワード変更</DialogTitle>
      <DialogContent sx={{ width: 350 }}>
        <DialogContentText>
          パスワードは本人以外に確認できません。
          <br />
          忘れないように注意してください。
        </DialogContentText>
        <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
          <InputLabel htmlFor="current-password">現在のパスワード</InputLabel>
          <Input
            id="current-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl sx={{ m: 1 }} variant="standard" fullWidth>
          <InputLabel htmlFor="new-password">新しいパスワード</InputLabel>
          <Input
            id="new-password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ width: 350 }}>
        <Button onClick={onClose}>キャンセル</Button>
        <Button onClick={() => changeAction()} color="primary">
          変更
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
