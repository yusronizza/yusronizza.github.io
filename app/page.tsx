"use client";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Skills } from "./Skills";
import localFont from 'next/font/local'
import Image from "next/image";
import {FaLinkedin, FaMap, FaVoicemail, FaGithub, FaInstagram} from 'react-icons/fa'

const myFont = localFont({ src: './font/Causten-Regular.otf' })

export default function Home() {
  const section_center = "flex text-center md:text-left lg-text-left sm:items-center md:items-center flex-row gap-y-4 py-4"
  const image_container = "flex justify-center items-center"
  return (
    <div className={myFont.className}>
      <Navbar></Navbar>
      <main className="flex min-h-screen flex-col items-center justify-between py-8 px-36 bg-gray-100 text-black gap-y-8">
      <div className="lg:left-36 w-96 lg:w-2/12 lg:fixed z-10 flex flex-col md:flex-row justify-center p-4 bg-white border border-gray-100 rounded-md drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col items-start mb-3 items-center md:flex-row md:mb-0">
          <div className="text-center items-center ">
            <div className={image_container}>
              <Image
                src="/Profile.png"
                alt="Yusron Izza F"
                width={100}
                height={100}
                className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
                priority
              />
            </div>
            <div className="font-bold text-xl">Yusron Izza Faradisa</div>
            <div className="">Bachelor of Electrical Engineering</div>
            <div className="">Yogyakarta, Indonesia</div>
            <div className="mt-3">Area of Interest</div>
            <div className="w-full bg-gray-100 p-2 rounded-md text-sm">
              Integrated Circuit Design
            </div>
            <div className="w-full bg-gray-100 p-2 rounded-md mt-2 text-sm">
              Embedded System
            </div>
            <div className="w-full bg-gray-100 p-2 rounded-md mt-2 mb-5 text-sm">
              Machine Learning
            </div>
            <div className="flex flex-row mt-2 gap-x-6 text-base items-center text-center justify-center">
              <a href="">
                <div className="flex items-center gap-2">
                  <FaMap className="text-xl" />
                </div>
              </a>
              <a href="https://www.linkedin.com/in/yusronizza">
                <div className="flex items-center gap-2">
                  <FaLinkedin className="text-2xl" />
                </div>
              </a>
              <a href="https://www.github.com/yusronizza">
                <div className="flex items-center gap-2">
                  <FaGithub className="text-2xl" />
                </div>
              </a>
              <a href="https://www.instagram.com/yusronizza">
                <div className="flex items-center gap-2">
                  <FaInstagram className="text-2xl" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="lg:w-3/12"></div>
        <div className="lg:w-9/12 flex flex-col gap-y-6">
        <div className="w-96 md:w-full bg-white rounded-md p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
          <div className="z-10 w-full items-center justify-center">
            <div className="flex flex-col w-full">
              <div className="font-bold text-2xl">About Me</div>
              <div className={section_center}>
                  Yusron Izza F is an undergraduate electrical engineering student at Universitas Gadjah Mada. He loves science and technology especially in electronics, computer, and programming. He has a strong foundation in computer programming, electronics design, and computer architecture. He likes to work in groups and lead groups. 
              </div>
              <div className="font-bold">Area of Expertise</div>
              <div className="flex flex-col md:flex-row gap-x-4 py-2 mb-2">
                <div className="flex w-full bg-white rounded-md p-2 gap-x-2 outline outline-offset-2 outline-1 outline-gray-300 shadow-sm">
                  <div className="">Logo</div>
                  <div className="">
                    <span className="font-bold text-sm">Embedded System</span>
                    <p>Creating embedded system design</p>
                  </div>
                </div>
                <div className="flex w-full bg-white rounded-md p-2 gap-x-2 outline outline-offset-2 outline-1 outline-gray-300 shadow-sm">
                  <div className="">Logo</div>
                  <div className="">
                    <span className="font-bold text-sm">Electronics Design</span>
                    <p>Creating electronics design</p>
                  </div>
                </div>
                <div className="flex w-full bg-white rounded-md p-2 gap-x-2 outline outline-offset-2 outline-1 outline-gray-300 shadow-sm">
                  <div className="">Logo</div>
                  <div className="">
                    <span className="font-bold text-sm">ASIC</span>
                    <p>Interested in ASIC design flow</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-x-2">
              <a href="cv/cv.pdf" className="bg-gray-400 hover:bg-gray-600 text-white p-2 px-4 rounded-2xl">Download CV</a>
              <a href="mailto:yusronizzafaradisa@gmail.com" className="bg-gray-400 hover:bg-gray-600 text-white p-2 px-4 rounded-2xl">Contact Me</a>
            </div>
          </div>
        </div>
        <div className="w-full bg-white rounded-md p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
        <div className="z-10 w-full items-center justify-between sticky">
          <div className="flex flex-col w-full">
            <div className="font-bold text-2xl">Education</div>
            <ol className="relative border-s border-gray-200 ml-2 mt-2 p-2">                  
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none">October 2024 - November 2024</time>
                    <h3 className="text-lg font-semibold text-gray-900">Ehime University</h3>
                    <h4 className="text-sm text-gray-500">Short Term Student Exchange Program</h4>
                    <p className="mb-4 text-base text-md">Activities and societies: Dependable computing Research Area (Dependable systems, Fault tolerant systems, Fault tolerant computing, Test and diagnosis of logic circuits, Design for testability of logic circuits).</p>
                </li>
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none">September 2020 - October 2024</time>
                    <h3 className="text-lg font-semibold text-gray-900">Universitas Gadjah Mada</h3>
                    <p className="text-base text-md">Activities and societies: Keluarga Mahasiswa Teknik Elektro dan Teknologi Informasi (Student Association), Festival Gadjah Mada 2021, Technocorner UGM, Paguyuban Karya Salemba Empat UGM, PIMNAS 35.</p>
                </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="w-full bg-white rounded-md p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
        <div className="z-10 w-full items-center justify-between">
          <div className="flex flex-col">
            <div className="font-bold text-2xl">Experiences</div>
            <ol className="relative border-s border-gray-200 ml-2 mt-2 p-2">                  
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none">January  2024 - June 2024</time>
                    <h3 className="text-lg font-semibold text-gray-900">FPGA Engineer (Internship)</h3>
                    <h4 className="text-sm text-gray-500">PT Len Industri (Persero) - Bandung, Rep. of Indonesia</h4>
                    <p className="mb-4 text-base text-md">Developed radio communication modulation using Binary Phase Shift Keying and Quadrature Phase Shift Keying in Verilog HDL.</p>
                </li>
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none">October 2023 - December 2023</time>
                    <h3 className="text-lg font-semibold text-gray-900">Digital Signal Processing Lab Work Assistant</h3>
                    <h4 className="text-sm text-gray-500">Universitas Gadjah Mada - Yogyakarta, Rep. of Indonesia</h4>
                    <p className="mb-4 text-base text-md">Led session in Lab Work Practice: Frequency Spectrum and Filter Implementation using Python; Finite Impulse Response Implementation and Windowing using Python; Digital to Analog Converter and Analog to Digital Converter Implementation in STM32 Nucleo-F446RE Development Board Using Timer.</p>
                </li>
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none">September 2023 - December 2023</time>
                    <h3 className="text-lg font-semibold text-gray-900">Basic Electronics Lab Work Assistant</h3>
                    <h4 className="text-sm text-gray-500">Universitas Gadjah Mada - Yogyakarta, Rep. of Indonesia</h4>
                    <p className="mb-4 text-base text-md">Led session in Lab Work Practice: Instrumentation Amplifier; AC-DC Converter Regulator; Unit 3: Phase Shift Oscillator.</p>
                </li>
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none">August 2023 - December 2023</time>
                    <h3 className="text-lg font-semibold text-gray-900">Data Communication and Network Lab Work Assistant</h3>
                    <h4 className="text-sm text-gray-500">Universitas Gadjah Mada - Yogyakarta, Rep. of Indonesia</h4>
                    <p className="mb-4 text-base text-md">Led session in Lab Work Practice: Asynchronous Serial Communication; Digital Modulation; Unit 3: Digital Communication.</p>
                </li>
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none">January 2023 - February 2023</time>
                    <h3 className="text-lg font-semibold text-gray-900">Instrumentation and Control Engineer (Internship)</h3>
                    <h4 className="text-sm text-gray-500">PT Nusa Halmahera Minerals - North Halmahera Regency, North Maluku, Rep. of Indonesia</h4>
                    <p className="mb-4 text-base text-md">Developed PID value calculator from the SCADA historic data controller performance.</p>
                </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="bg-white w-full rounded-md p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
        <div className="z-10 w-full items-center justify-between">
          <div className="flex flex-col">
            <div className="font-bold text-2xl">Skills</div>
            <div className="font-bold text-gray-600 text-sm py-2">Programming Language</div>
            <div className="flex flex-col md:flex-row gap-x-12 py-2 items-center">
            <div className="w-1/2 flex flex-row py-2 items-center">
              <div className="w-2/12">
                <Image
                  src="/programming/c.png"
                  alt="Next.js Logo"
                  width={35}
                  height={35}
                  priority
                />
              </div>
              <div className="w-10/12">
                <span className="font-bold">C</span>
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "60%" }}> 60%</div>
                </div>
              </div>
            </div>
            <div className="w-1/2 flex flex-row py-2 items-center">
              <div className="w-2/12">
                <Image
                  src="/programming/Python.png"
                  alt="Next.js Logo"
                  width={35}
                  height={35}
                  priority
                />
              </div>
              <div className="w-10/12">
                <span className="font-bold">Python</span>
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "80%" }}> 80%</div>
                </div>
              </div>
            </div>
            </div>
            
          </div>
        </div>
      </div>
      </div>
      </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
