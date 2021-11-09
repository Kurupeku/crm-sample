import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";

const getPathRoot = (path: string) => {
  if (/^\/inquiries/.test(path)) {
    return "inquiries";
  } else if (/^\/users/.test(path)) {
    return "users";
  } else if (/^\/staffs/.test(path)) {
    return "staffs";
  } else {
    return "root";
  }
};

const DrawerMenu: React.FC = () => {
  const router = useRouter();
  const currentRoot = getPathRoot(router.pathname);

  return (
    <>
      <List>
        <Link href="/" passHref>
          <ListItemButton selected={currentRoot === "root"}>
            <ListItemIcon>
              <AssignmentReturnedIcon />
            </ListItemIcon>
            <ListItemText primary="担当案件一覧" />
          </ListItemButton>
        </Link>
        <Link href="/inquiries" passHref>
          <ListItemButton selected={currentRoot === "inquiries"}>
            <ListItemIcon>
              <MoveToInboxIcon />
            </ListItemIcon>
            <ListItemText primary="問い合わせ一覧" />
          </ListItemButton>
        </Link>
        <Link href="/users" passHref>
          <ListItemButton selected={currentRoot === "users"}>
            <ListItemIcon>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText primary="ユーザー管理" />
          </ListItemButton>
        </Link>
      </List>
      <Divider />
      <List>
        <Link href="/staffs" passHref>
          <ListItemButton selected={currentRoot === "staffs"}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="スタッフ管理" />
          </ListItemButton>
        </Link>
      </List>
    </>
  );
};

export default DrawerMenu;
