import { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import { useRouter } from "next/router";

const Wrapper: FC<{ naked?: boolean }> = ({ children, naked }) => {
  return naked ? (
    <>{children}</>
  ) : (
    <Box sx={{ marginBottom: 2 }}>{children}</Box>
  );
};

const Breads: FC<{ naked?: boolean }> = (props) => {
  const { naked } = props;
  const router = useRouter();
  const paths = router.asPath
    .replace(/\?.*$/, "")
    .split("/")
    .filter((p) => p);

  return (
    <Wrapper naked={naked}>
      <Breadcrumbs aria-label="breadcrumb">
        {paths.map((path, i) => {
          if (i === paths.length - 1) {
            return <Typography key={i}>{path}</Typography>;
          } else {
            const href = "/" + paths.slice(0, i + 1).join("/");
            return (
              <Link key={i} href={href}>
                {path}
              </Link>
            );
          }
        })}
      </Breadcrumbs>
    </Wrapper>
  );
};

export default Breads;
