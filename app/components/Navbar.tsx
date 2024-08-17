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
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <a href="#" aria-current="page" className="text-amber-700">Home</a>
            </li>
            <li>
              <a href="about">About</a>
            </li>
            <li>
              <a href="business">Business</a>
            </li>
            <li>
              <a href="services">Services</a>
            </li>
            <li>
              <a href="projects">Projects</a>
            </li>
            <li>
              <a href="mailto:yusronizzafaradisa@gmail.com">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
