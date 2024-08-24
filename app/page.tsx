import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function GenerateCard(title: string, subTitle: string, body: string) {
  return (
    <Card sx={{ width: 275 }}>
      <CardContent>
        <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body1">{subTitle}</Typography>
        <Typography color="text.secondary">{body}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Start</Button>
      </CardActions>
    </Card>
  );
}

export default function Page() {
  return (
    <Stack
      direction="row"
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      {GenerateCard(
        "Ephemeral",
        "Enter a room that uses sockets",
        "Only participants of the same room will receive the message at the given moment in time"
      )}
      {GenerateCard(
        "Persisted",
        "Enter a room that uses firebase",
        "Messages will be encrypted and stored in a firebase instance. Not yet available"
      )}
    </Stack>
  );
}
