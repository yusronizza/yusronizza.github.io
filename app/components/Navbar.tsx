import Link from "next/link";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-white text-black px-8 py-4 z-40 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <a href="" className="text-md pl-28">
            Yusron Izza's Online CV
          </a>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="text-md flex flex-col px-4 md:pr-28 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <a href="/" className="rounded-xl bg-gray-200 p-3">Home</a>
              </li>
              <li>
                <a href="about">Portfolio</a>
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
      </div>
    </nav>
  );
};
