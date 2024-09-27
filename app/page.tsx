"use client";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Skills } from "./Skills";
import Image from "next/image";

export default function Home() {
  const section_center = "flex text-center md:text-left lg-text-left sm:items-center md:items-center flex-col gap-y-6 py-4"
  const item_section = "flex flex-col md:flex-row xl:flex-row gap-x-4 w-full flex-center"
  const image_container = "flex justify-center items-center"
  const desc_class = "text-sm text-justify"
  return (
    <div className="">
      <Navbar></Navbar>
      <main className="flex min-h-screen flex-col items-center justify-between p-12 bg-gray-100 text-black gap-y-8 md:pl-64">
      <div id="section-education" className="bg-white rounded-xl p-4 shadow-md">
        <div className="z-10 w-full items-center justify-between sticky">
          <div className="flex flex-col w-full justify-center items-center">
            <div className="font-bold text-2xl text-center">EDUCATION</div>
            <div className={section_center}>
              <div className={item_section}>
                <div className="basis-1/8">
                <div className={image_container}>
                  <Image
                    src="/ehime.jpg"
                    alt="Next.js Logo"
                    width={110}
                    height={110}
                    priority
                  />
                </div>
                </div>
                <div className="basis-3/5">
                  <div className="text-xl font-bold">
                    Ehime University
                    <div className="text-gray-500 text-sm">Matsuyama, Japan</div>
                  </div>
                  <div>Short Term Student Exchange Program</div>
                  <div className={desc_class}>Activities and societies: Dependable computing Research Area (Dependable systems, Fault tolerant systems, Fault tolerant computing, Test and diagnosis of logic circuits, Design for testability of logic circuits) under the guidance of Prof. Yoshinobu Higami.</div>
                </div>
                <div className="font-bold basis-1/7 text-sm sm:text-center md:text-left lg:text-left">
                  Oct 2024 - Nov 2024
                </div>
              </div>
              <div className={item_section}>
                <div className="basis-1/8">
                <div className={image_container}>
                  <Image
                    src="/ugm.jpg"
                    alt="Next.js Logo"
                    width={110}
                    height={110}
                    priority
                  />
                </div>
                </div>
                <div className="basis-3/5">
                  <div className="text-xl font-bold">
                    Universitas Gadjah Mada
                    <div className="text-gray-500 text-sm">Yogyakarta, Indonesia</div>
                  </div>
                  <div>Bachelor&apos;s degree, Electrical Engineering</div>
                  <div className={desc_class}>Activities and societies: Keluarga Mahasiswa Teknik Elektro dan Teknologi Informasi, Festival Gadjah Mada 2021, Technocorner UGM, Paguyuban Karya Salemba Empat UGM, PIMNAS 35</div>
                </div>
                <div className="basis-1/7 font-bold text-sm">
                  Sep 2020 - Nov 2024
                </div>
              </div>
            </div>       
          </div>
        </div>
      </div>
      <div id="section-experience" className="bg-white rounded-xl p-4 shadow-md w-full">
        <div className="z-10 w-full items-center justify-between">
          <div className="flex flex-col w-full justify-center">
            <div className="font-bold text-2xl text-center">EXPERIENCE</div>
            <div className={section_center}>
              <div className={item_section}>
                <div className="basis-1/8">
                <div className={image_container}>
                  <Image
                    src="/Logo_Len.png"
                    alt="Next.js Logo"
                    width={110}
                    height={110}
                    priority
                  />
                </div>
                </div>
                <div className="basis-3/5">
                  <div className="text-md font-bold">
                    FPGA Engineer
                    <div className="text-gray-500 text-sm">Bandung, Indonesia</div>
                  </div>
                  <div>PT Len Industri (Persero)</div>
                  <div className={desc_class}>Job Description:
                    <ul className="list-disc list-inside text-justify">
                      <li>Used ADRV9364-Z7020 All Programmable System on Module (SOM)</li>
                      <li>Implemented Amplitude Modulation (AM) using Embedded Linux in C Programming Language</li>
                      <li>Used MATLAB and Simulink to Model a System and HDL Coder to generate Verilog Code</li>
                    </ul>
                  </div>
                </div>
                <div className="basis-1/7 font-bold text-sm">
                Feb 2024 - Jun 2024
                </div>
              </div>
              <div className={item_section}>
                <div className="text-xl basis-1/8">
                <div className={image_container}>
                <Image
                  src="/ugm_career.jpg"
                  alt="Next.js Logo"
                  width={110}
                  height={110}
                  priority
                />
                </div>
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
                <div className="basis-1/7 font-bold text-sm">
                  Oct 2023 - Dec 2023
                </div>
              </div>
              <div className={item_section}>
                <div className="text-xl basis-1/8">
                <div className={image_container}>
                <Image
                  src="/ugm_career.jpg"
                  alt="Next.js Logo"
                  width={110}
                  height={110}
                  priority
                />
                </div>
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
                <div className="basis-1/7 font-bold text-sm">
                  Oct 2023 - Dec 2023
                </div>
              </div>
              <div className={item_section}>
                <div className="text-xl basis-1/8">
                <div className={image_container}>
                <Image
                  src="/ugm_career.jpg"
                  alt="Next.js Logo"
                  width={110}
                  height={110}
                  priority
                />
                </div>
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
                <div className="basis-1/7 font-bold">
                  October 2023 - December 2023
                </div>
              </div>
              <div className={item_section}>
                <div className="text-xl basis-1/8">
                <div className={image_container}>
                <Image
                  src="/ugm_career.jpg"
                  alt="Next.js Logo"
                  width={110}
                  height={110}
                  priority
                />
                </div>
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
                <div className="basis-1/7 font-bold">
                  October 2023 - December 2023
                </div>
              </div>
              <div className={item_section}>
                <div className="text-xl basis-1/8">
                <div className={image_container}>
                <Image
                  src="/ugm_career.jpg"
                  alt="Next.js Logo"
                  width={110}
                  height={110}
                  priority
                />
                </div>
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
                <div className="basis-1/7 font-bold">
                  October 2023 - December 2023
                </div>
              </div>
            </div>       
          </div>
        </div>
      </div>
      <Skills></Skills>
      </main>
      <Footer></Footer>
    </div>
  );
}
