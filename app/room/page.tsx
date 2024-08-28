"use client";
import { minidenticon } from "minidenticons";

import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Button,
  Chip,
  Container,
  ListItemAvatar,
  Stack,
  TextField,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { socket } from "../../src/socket";
import RoomDialog from "./roomDialog";
import { Message, Room, RoomEvent, UserJoined, UserLeft } from "./types";
import UserDialog from "./userDialog";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1, 0, 3),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

function getWindowDimensions() {
  if (typeof window !== "undefined") {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  } else {
    return {
      width: 400,
      height: 300,
    };
  }
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = React.useState(
    getWindowDimensions()
  );

  React.useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function MessageItem(message: Message, index: number) {
  const isUsersMessage = (message: Message) => {
    return socket.id === message.socketId;
  };
  return (
    <ListItem
      key={index}
      sx={{
        flexDirection: isUsersMessage(message) ? "row-reverse" : "row",
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={message.username}
          src={`data:image/svg+xml;utf8,${encodeURIComponent(
            minidenticon(message.socketId)
          )}`}
        />
      </ListItemAvatar>
      <ListItemText
        sx={
          isUsersMessage(message)
            ? {
                textAlign: "right",
                paddingRight: 2,
              }
            : {}
        }
        primary={message.message}
        secondary={
          <React.Fragment>
            <Typography
              sx={{
                display: isUsersMessage(message) ? "none" : "inline",
              }}
              component="span"
              variant="caption"
              color="text.primary"
            >
              {message.username} —&nbsp;
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "inline" }}
            >
              {message.date.toLocaleString()}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}

function UserJoinedLeftItem(event: UserJoined | UserLeft, index: number) {
  return (
    <ListItem key={index} sx={{ justifyContent: "center" }}>
      <Chip
        avatar={
          <Avatar
            alt={event.username}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              minidenticon(event.socketId)
            )}`}
          />
        }
        label={event.username}
        variant="outlined"
        size="small"
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "inline" }}
      >
        &nbsp;has {event.type === "userJoined" ? "joined" : "left"} the room.
      </Typography>
    </ListItem>
  );
}

export default function Page() {
  const theme = useTheme();
  const [receiptCounter, setReceiptCounter] = React.useState(0);
  const [username, setUsername] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(socket.connected);

  const [open, setOpen] = React.useState(true);
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = React.useState<Room>();
  const [message, setMessage] = React.useState("");

  let { height, width } = useWindowDimensions();

  height -= 128;
  width -= 48 + (open ? 240 : 0);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const sendMessage = () => {
    socket.emit("sendMessage", currentRoom?.name, message);
    setMessage("");
  };

  const addRoom = (roomName: string) => {
    const room: Room = {
      name: roomName,
      events: [],
    };
    setRooms([...rooms, room]);
    setCurrentRoom(room);
    socket.emit("joinRoom", roomName);
  };

  const startSession = (username: string) => {
    socket.auth = { username };
    socket.connect();
    setUsername(username);
  };

  const scrollRef = React.useRef<null | HTMLLIElement>(null);
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentRoom, currentRoom?.events.length]);

  React.useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  React.useEffect(() => {
    function roomEvent(roomName: string, event: RoomEvent) {
      console.log(roomName, event.type);
      rooms.find((room) => room.name === roomName)?.events.push(event);
      setRooms(rooms);
      setReceiptCounter(receiptCounter + 1);
    }

    socket.on("roomEvent", roomEvent);

    return () => {
      socket.off("roomEvent", roomEvent);
    };
  }, [rooms, receiptCounter]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <UserDialog onSubmit={startSession} />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentRoom?.name}
          </Typography>
          <Typography>{isConnected ? "Connected" : "Not Connected"}</Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography>Chat rooms</Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <RoomDialog
            isConnected={isConnected}
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries((formData as any).entries());
              const roomName = formJson.roomName;
              addRoom(roomName);
            }}
          />
          {rooms.map((room) => (
            <ListItem key={room.name} disablePadding>
              <ListItemButton
                onClick={() => {
                  setCurrentRoom(room);
                }}
              >
                <ListItemIcon>
                  <ChatBubbleIcon />
                </ListItemIcon>
                <ListItemText primary={room.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader id="header" />
        {currentRoom && (
          <Stack
            direction="column"
            justifyContent="stretch"
            sx={{ height: height, width }}
          >
            <List
              sx={{
                bgcolor: "background.paper",
                flexGrow: "1",
                overflow: "auto",
              }}
            >
              {currentRoom?.events.map((event, index) => {
                if (event.type === "message") {
                  return MessageItem(event, index);
                } else if (
                  event.type === "userJoined" ||
                  event.type === "userLeft"
                ) {
                  return UserJoinedLeftItem(event, index);
                }
              })}
              <ListItem ref={scrollRef} />
            </List>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="stretch"
              alignItems="center"
              sx={{ width }}
            >
              <TextField
                id="message"
                label="Type your message"
                variant="standard"
                value={message}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setMessage(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && isConnected) {
                    sendMessage();
                  }
                }}
                sx={{ width: "100%" }}
              />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={sendMessage}
                disabled={message.trim().length === 0 || !isConnected}
              >
                Send
              </Button>
            </Stack>
          </Stack>
        )}
        {!currentRoom && (
          <Container>
            <Typography>Join a room to start chatting :)</Typography>
          </Container>
        )}
      </Main>
    </Box>
  );
}
