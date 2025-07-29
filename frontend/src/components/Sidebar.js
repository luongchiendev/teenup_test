import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";

const drawerWidth = 240;

export default function Sidebar() {
  const { setSelectedMenu, selectedMenu } = useContext(AppContext);

  const menus = [
    { key: "parents", label: "Quản lý Phụ huynh" },
    { key: "students", label: "Quản lý Học sinh" },
    { key: "classes", label: "Danh sách Lớp" },
    { key: "register", label: "Quản lý gói học" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#f7f7f7",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Menu
        </Typography>
        <List>
          {menus.map((m) => (
            <ListItem key={m.key} disablePadding>
              <ListItemButton
                selected={selectedMenu === m.key}
                onClick={() => setSelectedMenu(m.key)}
              >
                <ListItemText primary={m.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
