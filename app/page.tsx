import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

export default function Page() {
  return (
    <Stack direction="row" spacing={2}>
      <TextField id="message" label="Type your message" variant="standard" />
      <Button variant="contained" endIcon={<SendIcon />}>
        Send
      </Button>
    </Stack>
  );
}
