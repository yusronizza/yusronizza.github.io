"use client";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-100 text-black font-mono gap-y-8">
      <div id="section-education" className="bg-white rounded-xl p-4 shadow-md">
        <div className="z-10 w-full items-center justify-between">
          <div className="flex flex-col w-full justify-center">
            <div className="font-bold text-2xl">EDUCATION</div>
            <div className="flex flex-col gap-y-6 py-4">
              <div className="flex flex-row gap-x-4 w-full flex-center">
                <div className="text-xl basis-1/8">
                <Image
                  src="/ehime.jpg"
                  alt="Next.js Logo"
                  width={110}
                  height={110}
                  priority
                />
                </div>
                <div className="basis-3/5">
                  <div className="text-xl font-bold">
                    Ehime University (UGM)
                    <div className="text-gray-500 text-sm">Matsuyama, Japan</div>
                  </div>
                  <div>Short Term Student Exchange Program</div>
                  <div className="text-sm">Activities and societies: Keluarga Mahasiswa Teknik Elektro dan Teknologi Informasi, Festival Gadjah Mada 2021, Technocorner UGM, Paguyuban Karya Salemba Empat UGM, PIMNAS 35</div>
                </div>
                <div className="text-left basis-1/7">
                  <div className="font-bold">
                    October 2024 - November 2024
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-x-4 w-full flex-center">
                <div className="text-xl basis-1/8">
                <Image
                  src="/ugm.jpg"
                  alt="Next.js Logo"
                  width={110}
                  height={110}
                  priority
                />
                </div>
                <div className="basis-3/5">
                  <div className="text-xl font-bold">
                    Universitas Gadjah Mada (UGM)
                    <div className="text-gray-500 text-sm">Yogyakarta, Indonesia</div>
                  </div>
                  <div>Bachelor's degree, Electrical Engineering</div>
                  <div className="text-sm">Activities and societies: Keluarga Mahasiswa Teknik Elektro dan Teknologi Informasi, Festival Gadjah Mada 2021, Technocorner UGM, Paguyuban Karya Salemba Empat UGM, PIMNAS 35</div>
                </div>
                <div className="text-left basis-1/7">
                  <div className="font-bold">
                    September 2020 - November 2024
                  </div>
                </div>
              </div>
            </div>       
          </div>
        </div>
      </div>
      <div id="section-experience" className="bg-white rounded-xl p-4 shadow-md w-full">
        <div className="z-10 w-full items-center justify-between">
          <div className="flex flex-col w-full justify-center">
            <div className="font-bold text-2xl">EXPERIENCE</div>
            <div className="flex flex-col gap-y-6 py-4">
              <div className="flex flex-row gap-x-4 w-full flex-center">
                <div className="text-xl basis-1/8">
                <Image
                  src="/Logo_Len.png"
                  alt="Next.js Logo"
                  width={110}
                  height={110}
                  priority
                />
                </div>
                <div className="basis-3/5">
                  <div className="text-md font-bold">
                    FPGA Engineer
                    <div className="text-gray-500 text-sm">Bandung, Indonesia</div>
                  </div>
                  <div>PT Len Industri (Persero)</div>
                  <div className="text-sm">Job Description:
                    <ul className="list-disc list-inside text-justify">
                      <li>Used ADRV9364-Z7020 All Programmable System on Module (SOM)</li>
                      <li>Implemented Amplitude Modulation (AM) using Embedded Linux in C Programming Language</li>
                      <li>Used MATLAB and Simulink to Model a System and HDL Coder to generate Verilog Code</li>
                    </ul>
                  </div>
                </div>
                <div className="text-left basis-1/7 font-bold">
                February 2024 - June 2024
                </div>
              </div>
              <div className="flex flex-row gap-x-4 w-full flex-center">
                <div className="text-xl basis-1/8">
                <Image
                  src="/ugm_career.jpg"
                  alt="Next.js Logo"
                  width={110}
                  height={110}
                  priority
                />
                </div>
                <div className="basis-3/5">
                  <div className="text-md font-bold">
                    Digital Signal Processing Junior Project Lab Work Assistant
                    <div className="text-gray-500 text-sm">Yogyakarta, Indonesia</div>
                  </div>
                  <div>Universitas Gadjah Mada</div>
                  <div className="text-sm">Job Description
                    <ul className="list-disc list-inside">
                      <li>Unit 1: Frequency Spectrum and Filter Implementation using Python</li>
                      <li>Unit 2: Finite Impulse Response Implementation and Windowing using Python</li>
                      <li>Unit 3: Digital to Analog Converter and Analog to Digital Converter Implementation in STM32 Nucleo-F446RE Development Board Using Timer.</li>
                    </ul>
                  </div>
                </div>
                <div className="text-right basis-1/7 font-bold">
                  September 2020 - November 2024
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
