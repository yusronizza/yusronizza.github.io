import Image from "next/image";

export const Skills = () => {
    const image_container = "flex justify-center items-center"
    return(
        <div id="section-skill" className="bg-white rounded-xl p-4 shadow-md w-full">
        <div className="z-10 w-full items-center justify-between">
          <div className="flex flex-col w-full justify-center items-center">
            <div className="font-bold text-2xl text-center">SKILLS</div>
            <div className="font-bold text-gray-600 text-sm text-center py-2">Programming Language & Digital Design</div>
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
            <div className="font-bold text-gray-600 text-sm text-center py-2">Framework</div>
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
                  Next.js
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
                  TensorFlow
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
                  Tailwind CSS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}