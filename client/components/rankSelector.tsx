import { FC, useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  useChangeProgressRankMutation,
  ProgressRankEnum,
} from "../graphql/client";

interface Props {
  progressId: string;
  currentRank?: string;
  refetchFunc: () => void;
}

const options: { label: string; value: ProgressRankEnum }[] = [
  { label: "A", value: ProgressRankEnum.A },
  { label: "B", value: ProgressRankEnum.B },
  { label: "C", value: ProgressRankEnum.C },
  { label: "D", value: ProgressRankEnum.D },
];

const RankSelector: FC<Props> = (props) => {
  const { progressId, currentRank, refetchFunc } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [updateAction, {}] = useChangeProgressRankMutation({
    onCompleted: () => {
      enqueueSnackbar("見込みランクを変更しました", { variant: "success" });
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
          rank: event.target.value as ProgressRankEnum,
        },
      },
    });
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: "80px", marginLeft: 2 }}>
      <InputLabel id="select-rank-label">ランク</InputLabel>
      <Select
        labelId="select-rank-label"
        value={currentRank?.toLocaleLowerCase() || "d"}
        onChange={handleChange}
        label="ランク"
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

export default RankSelector;
