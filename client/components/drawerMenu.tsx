import React from "react";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";

const DrawerMenu: React.FC = () => {
  return (
    <>
      <List>
        <Link href="/" passHref>
          <ListItem button>
            <ListItemIcon>
              <AssignmentReturnedIcon />
            </ListItemIcon>
            <ListItemText primary="担当案件一覧" />
          </ListItem>
        </Link>
        <Link href="/inquiries" passHref>
          <ListItem button>
            <ListItemIcon>
              <MoveToInboxIcon />
            </ListItemIcon>
            <ListItemText primary="問い合わせ一覧" />
          </ListItem>
        </Link>
        <Link href="/users" passHref>
          <ListItem button>
            <ListItemIcon>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText primary="ユーザー管理" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <Link href="/staffs" passHref>
          <ListItem button>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="スタッフ管理" />
          </ListItem>
        </Link>
      </List>
    </>
  );
};

export default DrawerMenu;
