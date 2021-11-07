import { FC, useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  useChangeProgressStaffMutation,
  useGetStaffsOnlyNameQuery,
} from "../graphql/client";

interface Option {
  label: string;
  value: string;
}

interface Props {
  progressId: string;
  currentStaffId?: string;
  refetchFunc: () => void;
}

const StaffSelector: FC<Props> = (props) => {
  const { progressId, currentStaffId, refetchFunc } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [options, setOptions] = useState<Option[]>([]);

  const { data: staffsData, loading } = useGetStaffsOnlyNameQuery();
  const [updateAction, {}] = useChangeProgressStaffMutation({
    onCompleted: () => {
      enqueueSnackbar("担当スタッフを変更しました", { variant: "success" });
      refetchFunc();
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const handleChange = (event: SelectChangeEvent) => {
    updateAction({
      variables: {
        input: {
          id: progressId,
          staffId: parseInt(event.target.value, 10),
        },
      },
    });
  };

  useEffect(() => {
    if (!staffsData) return;

    setOptions(
      staffsData.staffs.map(({ id, name }) => ({ label: name, value: id }))
    );
  }, [staffsData]);

  return (
    <FormControl variant="standard" sx={{ minWidth: "80px", marginLeft: 2 }}>
      <InputLabel id="select-staff-label">担当スタッフ</InputLabel>
      <Select
        labelId="select-staff-label"
        value={currentStaffId}
        onChange={handleChange}
        label="担当スタッフ"
      >
        {options.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StaffSelector;
