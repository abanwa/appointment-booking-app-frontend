import { createContext, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data?.success) {
        console.log(
          "doctorsList from getDoctorData in APpContext : ",
          data?.doctors
        );
        setDoctors(data?.doctors);
      } else {
        console.log("could not get doctors: ", data.message);
        toast.error(data.message);
      }
    } catch (err) {
      console.log("Error from getDoctorsData : ", err);
      toast.error(err.message);
    }
  }, [backendUrl]);

  const loadUserProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token }
      });
      if (data?.success) {
        console.log(
          "userProfile from loadUserProfileData in AppContext : ",
          data?.userData
        );
        setUserData(data?.userData);
      } else {
        console.log("could not get user profile: ", data.message);
        toast.error(data.message);
      }
    } catch (err) {
      console.log("Error from loadUserProfileData : ", err);
      toast.error(err.message);
    }
  }, [backendUrl, token]);

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData
  };

  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [loadUserProfileData, token]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
