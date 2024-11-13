"use client";
import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Collapse,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  return (
    <div className="flex">
      <Box
        sx={{
          width: expanded ? 200 : 60,
          bgcolor: "var(--background)",
          color: "var(--foreground)",
          height: "100vh",
          transition: "width 0.5s",
          overflow: "hidden",
          // position: "fixed",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid grey",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <List>
          <ListItem component="button">
            <ListItemIcon>
              <HomeIcon sx={{ color: "var(--foreground)" }} />
            </ListItemIcon>
            <Collapse in={expanded} timeout={500} unmountOnExit>
              <ListItemText primary="Home" />
            </Collapse>
          </ListItem>
          <ListItem component="button">
            <ListItemIcon>
              <AssignmentIcon sx={{ color: "var(--foreground)" }} />
            </ListItemIcon>
            <Collapse in={expanded} timeout={500} unmountOnExit>
              <ListItemText primary="Tasks" />
            </Collapse>
          </ListItem>
          <ListItem component="button">
            <ListItemIcon>
              <DescriptionIcon sx={{ color: "var(--foreground)" }} />
            </ListItemIcon>
            <Collapse in={expanded} timeout={500} unmountOnExit>
              <ListItemText primary="Docs" />
            </Collapse>
          </ListItem>
          <Divider sx={{ bgcolor: "grey.700" }} />
          <ListItem component="button">
            <ListItemIcon>
              <ChatIcon sx={{ color: "var(--foreground)" }} />
            </ListItemIcon>
            <Collapse in={expanded} timeout={500} unmountOnExit>
              <ListItemText primary="Chat" />
            </Collapse>
          </ListItem>
          <Divider sx={{ bgcolor: "grey.700" }} />

          <ListItem component="button">
            <ListItemIcon>
              <PeopleIcon sx={{ color: "var(--foreground)" }} />
            </ListItemIcon>
            <Collapse in={expanded} timeout={500} unmountOnExit>
              <ListItemText primary="User Management" />
            </Collapse>
          </ListItem>
        </List>
        <Box>
          <Divider sx={{ bgcolor: "grey.700" }} />
          <ListItem>
            <ListItemIcon>
              <Avatar
                src="/path/to/user/photo.jpg"
                sx={{ width: 30, height: 30 }}
              />
            </ListItemIcon>
            <Collapse in={expanded} timeout={500} unmountOnExit>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListItemText primary="User Name" />
                <IconButton sx={{ color: "var(--foreground)" }}>
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Collapse>
          </ListItem>
        </Box>
      </Box>
      <main className="w-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
