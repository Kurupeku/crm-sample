import React, { FC, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DatePicker from "@mui/lab/DatePicker";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  useGetStaffsOnlyNameQuery,
  useGetMenusOnlyNameQuery,
  ProgressRankEnum,
} from "../graphql/client";

export interface FormData {
  id: string | null;
  companyName?: string;
  name: string;
  email: string;
  tel: string;
  introductoryTerm: string;
  numberOfUsers: number;
  detail?: string;
  menuIds: number[];
  staffId: number | null;
  rank: number;
}

interface StaffOption {
  label: string;
  value: string;
}

interface MenuOption {
  label: string;
  value: number;
}

interface Props {
  data: FormData | null;
  onChange: (key: string, value: unknown) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const RankMap: { [key: string]: number } = {
  d: 0,
  c: 1,
  b: 2,
  a: 3,
};

const InquiryFormDialog: FC<Props> = (props) => {
  const { data, onChange, onSubmit, onCancel } = props;
  const [menuOptions, setMenuOptions] = useState<MenuOption[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);

  const { data: menusPayload } = useGetMenusOnlyNameQuery();
  const { data: staffsPayload } = useGetStaffsOnlyNameQuery();

  useEffect(() => {
    if (!menusPayload) return;

    setMenuOptions(
      menusPayload.menus.map(({ id, name }) => ({
        label: name,
        value: parseInt(id, 10),
      }))
    );
  }, [menusPayload]);

  useEffect(() => {
    if (!staffsPayload) return;

    setStaffOptions([
      { label: "未割当", value: "" },
      ...staffsPayload.staffs.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    ]);
  }, [staffsPayload]);

  const isChecked = (menuId: number) => {
    if (!data) return false;

    return data.menuIds.includes(menuId);
  };

  const handleMenuId = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;

    const value = parseInt(e.target.value, 10);
    let newMenuIds: number[];
    if (e.target.checked) {
      newMenuIds = [...data.menuIds, value];
    } else {
      newMenuIds = data.menuIds.filter((id) => id !== value);
    }
    onChange("menuIds", newMenuIds);
  };

  const handleStaffId = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;

    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    onChange("staffId", value);
  };

  const handleRank = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;

    onChange("rank", parseInt(e.target.value, 10));
  };

  return !data ? null : (
    <Dialog open={!!data} onClose={onCancel} maxWidth="sm">
      <DialogContent>
        <TextField
          select
          label="担当スタッフ"
          value={data.staffId}
          onChange={handleStaffId}
          variant="standard"
          fullWidth
          sx={{ marginBottom: 4 }}
        >
          {staffOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <FormControl component="fieldset" sx={{ marginBottom: 4 }}>
          <FormLabel>見込みランク</FormLabel>
          <RadioGroup row name="rank" value={data.rank} onChange={handleRank}>
            {Object.entries(RankMap)
              .reverse()
              .map((pair) => (
                <FormControlLabel
                  key={pair[0]}
                  value={pair[1]}
                  control={<Radio />}
                  label={pair[0].toUpperCase()}
                />
              ))}
          </RadioGroup>
        </FormControl>
        <Divider sx={{ marginBottom: 4 }} />
        <TextField
          type="text"
          label="会社名"
          value={data.companyName}
          variant="standard"
          onChange={(e) => onChange("companyName", e.target.value)}
          fullWidth
          sx={{ marginBottom: 4 }}
        />
        <TextField
          type="text"
          label="顧客名"
          value={data.name}
          variant="standard"
          onChange={(e) => onChange("name", e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 4 }}
        />
        <TextField
          type="text"
          label="Email"
          value={data.email}
          variant="standard"
          onChange={(e) => onChange("email", e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 4 }}
        />
        <TextField
          type="text"
          label="TEL"
          value={data.tel}
          variant="standard"
          onChange={(e) => onChange("tel", e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 4 }}
        />
        <TextField
          type="number"
          label="利用想定人数"
          value={data.numberOfUsers}
          variant="standard"
          onChange={(e) =>
            onChange("numberOfUsers", parseInt(e.target.value, 10))
          }
          fullWidth
          required
          sx={{ marginBottom: 4 }}
        />
        <TextField
          type="text"
          label="導入時期"
          value={data.introductoryTerm}
          variant="standard"
          onChange={(e) => onChange("introductoryTerm", e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 4 }}
        />
        <TextField
          type="text"
          label="詳細"
          value={data.detail}
          variant="standard"
          onChange={(e) => onChange("detail", e.target.value)}
          fullWidth
          multiline
          maxRows={4}
          sx={{ marginBottom: 4 }}
        />
        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend">問い合わせ項目</FormLabel>
          <FormGroup>
            {menuOptions.map(({ label, value }) => (
              <FormControlLabel
                key={`check-${value}`}
                control={
                  <Checkbox
                    checked={isChecked(value)}
                    onChange={handleMenuId}
                    name="menuIds"
                    value={value}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          キャンセル
        </Button>
        <Button onClick={onSubmit} color="primary">
          {data && !data.id ? "作成" : "更新"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InquiryFormDialog;
