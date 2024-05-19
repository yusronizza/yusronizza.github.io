import Link from "next/link";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  return (
    <nav className="bg-black text-white px-28 py-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <a href="" className="text-1xl font-bold">
          Yusron Izza
        </a>
        <div></div>
      </div>
    </nav>
  );
};
