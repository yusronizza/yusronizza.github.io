import React from "react";
import Image from "next/image";

export const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="bg-white shadow-xl shadow-inner p-8 text-black">
      <div className="flex items-center flex-col w-full max-w-screen-xl mx-auto">
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500">
            <li>
              <a href="https://yusronizza.github.io/" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="https://yusronizza.github.io/" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="https://yusronizza.github.io/" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="mailto:yusronizzafaradisa@gmail.com" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        <hr className="border-gray-200" />
        <span className="block text-sm text-gray-500 text-center">
          © {year}{" "}
          <a href="https://yusronizza.github.com/" className="hover:underline">
            Yusron Izza
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};
