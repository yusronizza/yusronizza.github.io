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
      <div className="left-36 fixed z-50 flex flex-col md:flex-row justify-between p-4 bg-white border border-gray-100 rounded-md shadow-md lg:max-w-7xl">
          <div className="flex flex-col items-start mb-3 me-4 md:items-center md:flex-row md:mb-0">
              <div className="text-center items-center ">
                <div className={image_container}>
                  <Image
                    src="/Profile.png"
                    alt="Yusron Izza F"
                    width={150}
                    height={150}
                    priority
                  />
                </div>
                <div className="font-bold text-xl">Yusron Izza Faradisa</div>
                <div className="">Bachelor of Electrical Engineering</div>
                <div className="">Yogyakarta, Indonesia</div>
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
      <div className="bg-white rounded-md p-4 shadow-md ml-80">
        <div className="z-10 w-full items-center justify-between sticky">
          <div className="flex flex-col w-full">
            <div className="font-bold text-2xl">About Me</div>
            <div className={section_center}>
                Yusron Izza F is an undergraduate electrical engineering student at Universitas Gadjah Mada. He loves science and technology especially in electronics, computer, and programming. He has a strong foundation in computer programming, electronics design, and computer architecture. He likes to work in groups and lead groups. 
            </div>
            <div>Area of Expertise</div>
          </div>
          <div className="flex gap-x-2">
            <a href="cv/cv.pdf" className="bg-gray-400 hover:bg-gray-600 text-white p-2 px-4 rounded-2xl">Download CV</a>
            <a href="mailto:yusronizzafaradisa@gmail.com" className="bg-gray-400 hover:bg-gray-600 text-white p-2 px-4 rounded-2xl">Contact Me</a>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-md p-4 shadow-md ml-80">
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
      <div className="bg-white rounded-md p-4 shadow-md ml-80">
        <div className="z-10 w-full items-center justify-between">
          <div className="flex flex-col">
            <div className="font-bold text-2xl">Experiences</div>
            <ol className="relative border-s border-gray-200 ml-2 mt-2 p-2">                  
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none">January  2024 - June 2024</time>
                    <h3 className="text-lg font-semibold text-gray-900">FPGA Engineer (Intership)</h3>
                    <h4 className="text-sm text-gray-500">PT Len Industri (Persero) - Bandung, Rep. of Indonesia</h4>
                    <p className="mb-4 text-base text-md">Developed radio communication modulation using Binary Phase Shift Keying and Quadrature Phase Shift Keying in Verilog HDL.</p>
                </li>
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none">October 2023 - December 2023</time>
                    <h3 className="text-lg font-semibold text-gray-900">Digital Signal Processing Lab Work Assistant</h3>
                    <h4 className="text-sm text-gray-500">Universitas Gadjah Mada - Yogyakarta, Rep. of Indonesia</h4>
                    <p className="text-base text-md">Led session in Lab Work Practice: Frequency Spectrum and Filter Implementation using Python; Finite Impulse Response Implementation and Windowing using Python; Digital to Analog Converter and Analog to Digital Converter Implementation in STM32 Nucleo-F446RE Development Board Using Timer.</p>
                </li>
            </ol>
          </div>
        </div>
      </div>
      <Skills></Skills>
      </main>
      <Footer></Footer>
    </div>
  );
}
