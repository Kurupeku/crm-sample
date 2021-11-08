import { FC } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
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
                <Button sx={{ p: 0 }} color="inherit">
                  {path}
                </Button>
              </Link>
            );
          }
        })}
      </Breadcrumbs>
    </Wrapper>
  );
};

export default Breads;
