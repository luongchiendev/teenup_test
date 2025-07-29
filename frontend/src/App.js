import React, { useContext } from "react";
import Sidebar from "./components/Sidebar";
import ParentManager from "./components/ParentManager";
import StudentManager from "./components/StudentManager";
import ClassSchedule from "./components/ClassSchedule";
import { AppContext } from "./context/AppContext";
import SubscriptionManager from "./components/Subscription";

import { Box, Container, Typography, Paper } from "@mui/material";

function App() {
  const { selectedMenu } = useContext(AppContext);

  const renderContent = () => {
    switch (selectedMenu) {
      case "parents":
        return <ParentManager />;
      case "students":
        return <StudentManager />;
      case "classes":
        return <ClassSchedule />;
      case "register":
        return <SubscriptionManager />;
      default:
        return <Typography variant="body1">Chọn menu bên trái</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Sidebar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Mini LMS
          </Typography>
          {renderContent()}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
