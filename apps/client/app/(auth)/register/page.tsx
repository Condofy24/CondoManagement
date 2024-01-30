"use client"

import React from "react";
import { logIn, logOut } from "@/redux/features/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <button onClick={() => dispatch(logOut())} style={{padding: "100px"}}>
        Click
      </button>
    </>
  );
}
