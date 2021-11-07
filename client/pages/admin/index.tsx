import { FC, useState } from "react";
import InquiriesIndexBase from "../../components/inquiriesIndexBase";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Breads from "../../components/breadcrumbs";
import { ProgressStateEnum } from "../../graphql/client";
import { currentStaffState } from "../../modules/atoms";
import { useRecoilValue } from "recoil";

const stateMap = [
  ProgressStateEnum.Waiting,
  ProgressStateEnum.WaitingRecontact,
  ProgressStateEnum.Contacting,
  ProgressStateEnum.Estimating,
  ProgressStateEnum.Ordered,
  ProgressStateEnum.Archived,
];

const InquiriesIndex: FC = () => {
  const [index, setIndex] = useState<number>(0);
  const currentStaff = useRecoilValue(currentStaffState);

  const handleIndex = (_: unknown, newIndex: number) => setIndex(newIndex);

  const state: ProgressStateEnum | undefined = stateMap[index];

  return (
    <Container maxWidth="xl" sx={{ marginTop: 2 }}>
      <Paper>
        <AppBar color="primary" elevation={0} position="static">
          <Tabs
            value={index}
            onChange={handleIndex}
            indicatorColor="primary"
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab label="未着手" tabIndex={0} />
            <Tab label="再度連絡待ち" tabIndex={1} />
            <Tab label="連絡中" tabIndex={2} />
            <Tab label="見積中" tabIndex={3} />
            <Tab label="受注済み" tabIndex={4} />
            <Tab label="対応済み" tabIndex={5} />
            <Tab label="全案件" tabIndex={6} />
          </Tabs>
        </AppBar>
        <InquiriesIndexBase
          state={state}
          staffId={currentStaff ? parseInt(currentStaff.id, 10) : undefined}
          title="担当案件一覧"
        />
      </Paper>
    </Container>
  );
};

export default InquiriesIndex;
