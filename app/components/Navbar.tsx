import Link from "next/link";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  return (
    <nav className="bg-white text-black px-8 py-6 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <a href="" className="text-1xl font-bold">
          Curriculum Vitae
        </a>
        <div></div>
      </div>
    </nav>
  );
};
