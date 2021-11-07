import { FC, useState, useEffect, useMemo } from "react";
import { useSnackbar } from "notistack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  useGetProgressStateAndEventsQuery,
  useChangeProgressStateMutation,
  ProgressEventEnum,
} from "../graphql/client";

interface Option {
  label: string;
  value: ProgressEventEnum;
}

interface Props {
  progressId: string;
  refetchFunc: () => void;
}

const StateChanger: FC<Props> = (props) => {
  const { progressId, refetchFunc } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [options, setOptions] = useState<Option[]>([]);

  const { data } = useGetProgressStateAndEventsQuery({
    variables: { progressId: progressId || "" },
  });

  const [changeAction, {}] = useChangeProgressStateMutation({
    onCompleted: () => {
      enqueueSnackbar("ステータスを更新しました", { variant: "success" });
      refetchFunc();
    },
    onError: (error) => {
      enqueueSnackbar(error.message, { variant: "error" });
    },
  });

  const handleChange = (event: SelectChangeEvent) => {
    changeAction({
      variables: {
        input: {
          id: progressId,
          event: event.target.value as ProgressEventEnum,
        },
      },
    });
  };

  useEffect(() => {
    if (!data) return;

    setOptions(
      data.progress?.selectableEvents.map(({ event, label }) => ({
        label,
        value: event as ProgressEventEnum,
      })) || []
    );
  }, [data]);

  const handleRender = () => data?.progress?.stateI18n || "";

  return (
    <FormControl variant="standard" sx={{ minWidth: "80px", marginLeft: 2 }}>
      <InputLabel id="select-state-label" shrink>
        ステータス
      </InputLabel>
      <Select
        labelId="select-state-label"
        onChange={handleChange}
        label="ステータス"
        value=""
        displayEmpty
        renderValue={handleRender}
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

export default StateChanger;
