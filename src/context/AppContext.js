import React, { createContext, useState, useEffect } from "react";
// import { api } from "../services/api";
import axios from "axios";
const { BACKEND_URL } = require('../urlConfig');

// Tạo context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState("parents");
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);

  // Lấy dữ liệu Parents khi load app
  const getListParents = async () => {
    try {
     const response = await axios.get(
      `${BACKEND_URL}/parents`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    if(response){
      setParents(response.data);
    }
  }
  catch (err) {
      return err;
    }
}

  const getListStudents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/students`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        setStudents(response.data);
      }
    } catch (err) {
      return err;
    }
  };


useEffect(() => {
const callApi = async () => {
  await getListParents();
  await getListStudents();
}
callApi();
}, [])

  const value = {
    selectedMenu,
    setSelectedMenu,
    parents,
    setParents,
    students,
    setStudents,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
