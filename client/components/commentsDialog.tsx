import { FC, useState, useEffect, forwardRef } from "react";
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";
import ja from "date-fns/locale/ja";
import { useSnackbar } from "notistack";
import { useRecoilValue } from "recoil";
import { currentStaffState } from "../modules/atoms";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Fab from "@mui/material/Fab";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Slide from "@mui/material/Slide";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import { TransitionProps } from "@mui/material/transitions";
import {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "../graphql/client";
import someoneAvatar from "../modules/avatar";

interface Comment {
  id: string;
  content: string;
  createdAt: number;
  staff?: {
    id: string;
    name: string;
    icon?: string | null;
  };
}

interface ItemProps {
  comment: Comment;
  owned?: boolean;
  onEditClick: (id: number, content: string) => void;
  refetchFunc: () => void;
}

interface Props {
  inquiryId: string;
}

const CommentItem: FC<ItemProps> = (props) => {
  const {
    comment: { id, content, createdAt, staff },
    owned,
    onEditClick,
    refetchFunc,
  } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [deleteAction, {}] = useDeleteCommentMutation({
    onCompleted: () => {
      enqueueSnackbar("コメントを作成しました", { variant: "success" });
      refetchFunc();
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const dateStr = format(fromUnixTime(createdAt), "yyyy/MM/dd HH:mm:ss", {
    locale: ja,
  });

  const handleDelete = () => deleteAction({ variables: { input: { id } } });

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar
          alt={`avatar-${staff?.id || "unknown"}`}
          src={staff?.icon || someoneAvatar}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {staff?.name || "不明なスタッフ"}
            </Typography>
            {owned ? (
              <>
                <IconButton
                  size="small"
                  onClick={() => onEditClick(parseInt(id, 10), content)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
              </>
            ) : null}
          </Box>
        }
        secondary={
          <>
            <Typography>{content}</Typography>
            <Typography variant="caption">{dateStr}</Typography>
          </>
        }
      />
    </ListItem>
  );
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CommentsDialog: FC<Props> = (props) => {
  const { inquiryId } = props;

  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [value, setValue] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const currentStaff = useRecoilValue(currentStaffState);

  const { data, refetch } = useGetCommentsQuery({
    skip: !open,
    variables: { inquiryId: parseInt(inquiryId, 10) },
  });

  const [createAction, {}] = useCreateCommentMutation({
    onCompleted: () => {
      enqueueSnackbar("コメントを作成しました", { variant: "success" });
      setValue("");
      refetch();
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const [updateAction, {}] = useUpdateCommentMutation({
    onCompleted: () => {
      enqueueSnackbar("コメントを編集しました", { variant: "success" });
      setEditId(null);
      setValue("");
      refetch();
    },
    onError: (error) => {
      error.message
        .split(",")
        .map((msg) => enqueueSnackbar(msg, { variant: "error" }));
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = (id: number, content: string) => {
    setEditId(id);
    setValue(content);
  };

  const cancelEdit = () => {
    setEditId(null);
    setValue("");
  };

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    if (editId) {
      updateAction({
        variables: { input: { id: String(editId), content: value } },
      });
    } else {
      if (!currentStaff) {
        enqueueSnackbar("セッション中のスタッフを特定できませんでした", {
          variant: "error",
        });
        return;
      }
      createAction({
        variables: {
          input: {
            inquiryId: parseInt(inquiryId, 10),
            staffId: parseInt(currentStaff.id, 10),
            content: value,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (!data) return;

    setComments(
      data.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        ...(comment.staff
          ? {
              staff: {
                id: comment.staff.id,
                name: comment.staff.name,
                icon: comment.staff.icon,
              },
            }
          : {}),
      }))
    );
  }, [data]);

  return !inquiryId ? null : (
    <>
      <Fab
        color="secondary"
        sx={{ position: "fixed", right: "1rem", bottom: "1rem" }}
        onClick={handleClickOpen}
      >
        <QuestionAnswerIcon />
      </Fab>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{ sx: { bgcolor: "background.default" } }}
      >
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ display: "flex", mb: 3 }}>
            <Typography variant="h4" component="h3" sx={{ flexGrow: 1 }}>
              コメント一覧
            </Typography>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Paper sx={{ p: 2 }}>
            <List sx={{ width: "100%" }}>
              <TextField
                placeholder="新しいコメント..."
                value={value}
                onChange={handleValue}
                fullWidth
                multiline
                rows="5"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  my: 2,
                }}
              >
                {editId ? (
                  <Button
                    color="error"
                    variant="contained"
                    sx={{ mr: 2 }}
                    onClick={cancelEdit}
                  >
                    編集を中止する
                  </Button>
                ) : null}
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  作成
                </Button>
              </Box>
              {comments.map((comment, i) => (
                <>
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    owned={currentStaff?.id === comment?.staff?.id}
                    onEditClick={handleEdit}
                    refetchFunc={refetch}
                  />
                  {i === comments.length - 1 ? null : (
                    <Divider variant="inset" component="li" />
                  )}
                </>
              ))}
            </List>
          </Paper>
        </Container>
      </Dialog>
    </>
  );
};

export default CommentsDialog;
