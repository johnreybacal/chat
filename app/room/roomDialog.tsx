import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as React from "react";

export default function RoomDialog(props: {
  onSubmit: (arg0: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <ListItem disablePadding>
        <ListItemButton onClick={handleClickOpen}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add room" />
        </ListItemButton>
      </ListItem>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            props.onSubmit(event);
            handleClose();
          },
        }}
      >
        <DialogTitle>Add room</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the room number you want to join
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="roomNumber"
            name="roomNumber"
            label="Room Number"
            variant="standard"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Enter</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
