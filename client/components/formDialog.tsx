import React, { FC } from "react";
import { useTheme } from "@mui/material/styles";
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
import Switch from "@mui/material/Switch";

interface FormRequireData {
  id: string | null;
}

export interface FormData extends FormRequireData {
  [name: string]: string | string[] | number | number[] | boolean | null;
}

export interface Choice {
  label: string;
  value: string | number;
}

export interface InputOption {
  name: string;
  label: string;
  required?: boolean;
  type?:
    | "text"
    | "textarea"
    | "integer"
    | "float"
    | "date"
    | "select"
    | "multiselect"
    | "boolean"
    | "email"
    | "password";
  choices?: Choice[];
  variant?: "standard" | "filled" | "outlined";
}

interface ReactableInputProps {
  data: InputOption;
  value: string | string[] | number | number[] | boolean | null;
  onChange: (key: string, value: unknown) => void;
}

interface FormDialogProps {
  data: FormData | null;
  options: InputOption[];
  onChange: (key: string, value: unknown) => void;
  onSubmit: () => void;
  onCancel: () => void;
  title?: string;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const ReactableInput: FC<ReactableInputProps> = (props) => {
  const theme = useTheme();
  const { data, value, onChange } = props;

  switch (data.type) {
    case "boolean":
      return (
        <FormControl sx={{ marginBottom: theme.spacing(4) }} fullWidth>
          <FormControlLabel
            control={<Switch value={value ? true : false} />}
            label={data.label}
          />
        </FormControl>
      );

    case "select":
    case "multiselect":
      return (
        <FormControl sx={{ marginBottom: theme.spacing(4) }} fullWidth>
          <InputLabel id={"label-" + data.type}>{data.label}</InputLabel>
          <Select
            labelId={"label-" + data.type}
            value={value}
            label={data.label}
            required={data.required}
            variant={data.variant || "standard"}
            multiple={data.type === "multiselect"}
            onChange={(e) => onChange(data.name, e.target.value)}
          >
            {data.choices?.map((choice) => (
              <MenuItem key={choice.value} value={choice.value}>
                {choice.label}
              </MenuItem>
            )) || null}
          </Select>
        </FormControl>
      );

    case "date":
      return (
        <DatePicker
          label={data.label}
          value={value}
          onChange={(newValue) => {
            onChange(data.name, newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required={data.required}
              variant={data.variant || "standard"}
              sx={{ marginBottom: theme.spacing(4) }}
              fullWidth
            />
          )}
        />
      );

    default:
      return (
        <TextField
          type={
            data.type === "integer" || data.type === "float"
              ? "number"
              : data.type || "text"
          }
          label={data.label}
          value={value}
          required={data.required}
          variant={data.variant || "standard"}
          onChange={(e) => onChange(data.name, e.target.value)}
          fullWidth
          sx={{ marginBottom: theme.spacing(4) }}
        />
      );
  }
};

const FormDialog: FC<FormDialogProps> = (props) => {
  const {
    data,
    options,
    title,
    submitLabel,
    cancelLabel,
    maxWidth,
    onChange,
    onSubmit,
    onCancel,
  } = props;

  return !data ? null : (
    <Dialog open={!!data} onClose={onCancel} maxWidth={maxWidth}>
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      <DialogContent>
        {options.map((opt, i) => (
          <ReactableInput
            key={opt.name + i}
            data={opt}
            value={!data[opt.name] ? "" : data[opt.name]}
            onChange={onChange}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelLabel || "キャンセル"}
        </Button>
        <Button onClick={onSubmit} color="primary">
          {submitLabel || (!data?.id ? "作成" : "更新")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
