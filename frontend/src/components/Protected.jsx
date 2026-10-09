import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const Protected = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAuth } = useContext(AuthContext);

  useEffect(() => {
    if (!user && !isAuth) {
      navigate("/login");
    }
  }, [user, isAuth]);

  return (children );
};

export default Protected;
