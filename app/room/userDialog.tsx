import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import * as React from "react";

export default function UserDialog(props: {
  onSubmit: (username: string) => void;
}) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason && reason === "backdropClick") return;
          handleClose();
        }}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const username = formJson.username;
            props.onSubmit(username);
            handleClose();
          },
        }}
      >
        <DialogTitle>Hello, there :)</DialogTitle>
        <DialogContent>
          <DialogContentText>
            What would you like to be called?
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="username"
            name="username"
            label="Username"
            variant="standard"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Let&apos;s Go!</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
