import React, { useContext } from "react";
import Sidebar from "./components/Sidebar";
import ParentManager from "./components/ParentManager";
import StudentManager from "./components/StudentManager";
import ClassSchedule from "./components/ClassSchedule";
// import RegisterClassForm from "./components/RegisterClassForm";
import { AppContext } from "./context/AppContext";
import SubscriptionManager from "./components/Subscription";

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
        return <div>Chọn menu bên trái</div>;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
          Mini LMS
        </h1>
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
