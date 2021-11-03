import React, { FC } from "react";

const SafeHydrate: FC = (props) => {
  return <>{props.children}</>;
};

export default SafeHydrate;
