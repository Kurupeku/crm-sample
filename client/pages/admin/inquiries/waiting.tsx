import { FC } from "react";
import InquiriesIndexBase from "./_index";
import { ProgressStateEnum } from "../../../graphql/client";

const InquiriesIndex: FC = () => {
  return <InquiriesIndexBase state={ProgressStateEnum.Waiting} />;
};

export default InquiriesIndex;
