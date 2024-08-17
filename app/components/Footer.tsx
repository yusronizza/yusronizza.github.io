import React from "react";

export const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="bg-white shadow-xl shadow-inner p-4 text-black">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://yusronizza.github.io/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Yusron Izza"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              Yusron Izza F
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0">
            <li>
              <a href="https://yusronizza.github.io/" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200" />
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
