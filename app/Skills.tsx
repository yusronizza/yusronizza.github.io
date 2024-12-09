import Image from "next/image";

export const Skills = () => {
    const image_container = "flex justify-center items-center"
    return(
        <div className="bg-white rounded-md p-4 shadow-md ml-80 w-2/3">
        <div className="z-10 w-full items-center justify-between">
          <div className="flex flex-col w-full">
            <div className="font-bold text-2xl">Skills</div>
            
            <div className="font-bold text-gray-600 text-sm py-2">Programming Language & Digital Design</div>
            <div className="flex flex-row gap-x-4 py-2 items-center">
              <div className="w-1/7">
                <Image
                  src="/programming/c.png"
                  alt="Next.js Logo"
                  width={35}
                  height={35}
                  priority
                />
              </div>
              <div className="w-full">
                <div>C</div>
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "45%" }}> 45%</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row gap-x-8 my-4">
              <div className="flex flex-col ">
                <div className={image_container}>
                  <Image
                    src="/programming/c.png"
                    alt="Next.js Logo"
                    width={50}
                    height={50}
                    priority
                  />
                </div>
                <div className="text-center">
                  C
                </div>
              </div>
              <div className="flex flex-col">
                <div className={image_container}>
                  <Image
                    src="/programming/cpp.png"
                    alt="Next.js Logo"
                    width={50}
                    height={50}
                    priority
                  />
                </div>
                <div className="text-center">
                  C++
                </div>
              </div>
              <div className="flex flex-col">
                <div className={image_container}>
                  <Image
                    src="/programming/python.png"
                    alt="Next.js Logo"
                    width={56}
                    height={56}
                    priority
                  />
                </div>
                <div className="text-center">
                  Python
                </div>
              </div>
              <div className="flex flex-col">
                <div className={image_container}>
                  <Image
                    src="/programming/sv.png"
                    alt="Next.js Logo"
                    width={84}
                    height={56}
                    priority
                  />
                </div>
                <div className="text-center">
                  SystemVerilog
                </div>
              </div>
            </div>
            <div className="font-bold text-gray-600 text-sm text-center py-2">Tools & Software</div>
            <div className="flex flex-row gap-x-8 my-4">
              <div className="flex flex-col ">
                <div className={image_container}>
                  <Image
                    src="/tools/altium-designer.png"
                    alt="Next.js Logo"
                    width={56}
                    height={56}
                    priority
                  />
                </div>
                <div className="text-center">
                  Altium
                </div>
              </div>
              <div className="flex flex-col">
                <div className={image_container}>
                  <Image
                    src="/tools/vitis.png"
                    alt="Next.js Logo"
                    width={150}
                    height={50}
                    priority
                  />
                </div>
                <div className="text-center">
                  Vitis
                </div>
              </div>
              <div className="flex flex-col">
                <div className={image_container}>
                  <Image
                    src="/tools/vivado.png"
                    alt="Next.js Logo"
                    width={56}
                    height={56}
                    priority
                  />
                </div>
                <div className="text-center">
                  Vivado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}