"use client";

import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

function StartCard(props: {
  title: string;
  subTitle: string;
  body: string;
  route?: string;
}) {
  const router = useRouter();
  return (
    <Fragment>
      <Card sx={{ width: 275 }}>
        <CardContent>
          <Typography sx={{ mb: 1.5 }} variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography variant="body1">{props.subTitle}</Typography>
          <Typography color="text.secondary">{props.body}</Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            disabled={!props.route}
            onClick={() => {
              if (props.route) {
                router.push(props.route);
              }
            }}
          >
            Start
          </Button>
        </CardActions>
      </Card>
    </Fragment>
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
      <StartCard
        title="Ephemeral"
        subTitle="Enter a room that uses sockets"
        body="Only participants of the same room will receive the message at the given moment in time"
        route="/room"
      ></StartCard>

      <StartCard
        title="Persisted"
        subTitle="Enter a room that uses firebase"
        body="Messages will be encrypted and stored in a firebase instance. Not yet available"
      ></StartCard>
    </Stack>
  );
}
