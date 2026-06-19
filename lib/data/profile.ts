/**
 * Profile/CV data, sourced from public/Yusron_Izza_Faradisa_CV.pdf.
 * Update that PDF and this file together so the site and the downloadable
 * CV stay in sync.
 */

export type SkillGroup = {
  category: string;
  skills: string[];
};

export type ExperienceEntry = {
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  summary?: string;
  highlights: string[];
};

export type EducationEntry = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
};

export type CertificationEntry = {
  name: string;
  issuer: string;
  date: string;
};

export type AwardEntry = {
  name: string;
  issuer: string;
  year: string;
  description?: string;
};

export type VolunteeringEntry = {
  role: string;
  organization: string;
  location: string;
  year: string;
  highlights: string[];
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  phone: string;
  website: string;
  tagline: string;
  bio: string[];
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  awards: AwardEntry[];
  volunteering: VolunteeringEntry[];
  languages: { name: string; level: string }[];
  interests: string[];
};

export const profile: Profile = {
  name: "Yusron Izza Faradisa",
  title: "Embedded Systems & IoT Engineer",
  location: "East Jakarta, Indonesia",
  phone: "+62 823-2385-8260",
  website: "https://yusronizza.com",
  tagline: "Building high-performance, scalable embedded and IoT solutions.",
  bio: [
    "I'm an embedded systems and IoT engineer with hands-on experience across microcontrollers, IoT, API integration, cloud services, and embedded software development on Raspberry Pi and STM32. I enjoy optimizing resource-constrained systems and collaborating across hardware and software boundaries.",
    "Most recently, I've been building firmware and a payment-gateway integration for IoT devices at PT Nusapala Berkah Autonomous, after working on FPGA-based RF signal processing at PT Len Industri and instrumentation systems at PT Nusa Halmahera Minerals.",
    "Outside of my day-to-day work, I teach robotics to elementary students at Jago Robotika, and I spent a short exchange program at Ehime University researching LLM-based lie detection — a reminder that I enjoy stretching beyond hardware into adjacent fields like machine learning.",
  ],
  skills: [
    {
      category: "Programming",
      skills: ["Python", "Go", "C", "Verilog", "MATLAB"],
    },
    {
      category: "Tools",
      skills: ["Vivado", "Vitis", "STM32CubeIDE", "Git", "VS Code"],
    },
    {
      category: "Frameworks",
      skills: ["Wails", "Next.js", "Tailwind CSS"],
    },
    {
      category: "Libraries",
      skills: ["NumPy", "Pandas", "TensorFlow", "Matplotlib"],
    },
  ],
  experience: [
    {
      role: "Electrical and Electronics Engineer",
      organization: "CBS Techno Co. Ltd.",
      location: "Nagoya, Japan",
      startDate: "2026-01",
      endDate: "Present",
      highlights: [
        "Studying Japanese language until N3 level",  
      ],
    },
    {
      role: "Embedded Engineer",
      organization: "PT Nusapala Berkah Autonomous",
      location: "West Jakarta, Indonesia",
      startDate: "2025-05",
      endDate: "2025-12",
      highlights: [
        "Collaborated with cross-functional teams to prototype and optimize hardware–software interfaces, improving system stability and response time.",
        "Developed firmware libraries for the ACR122U NFC reader from Python to Go language, enabling seamless integration.",
        "Designed and integrated a payment gateway for IoT-based embedded devices, enabling real-time, secure transactions between hardware and cloud services.",
        "Contributed to firmware testing and continuous integration pipelines, ensuring code quality and maintainability.",
      ],
    },
    {
      role: "Online Robotics Teaching Tutor (Part-time)",
      organization: "Jago Robotika",
      location: "Yogyakarta, Indonesia",
      startDate: "2022-09",
      endDate: "Present",
      highlights: [
        "Led robotics classes for elementary students at prestigious schools, including Lukman Hakim International and Teladan, introducing fundamentals of electronics and programming.",
        "Designed, assembled, and soldered custom electronic teaching kits; performed troubleshooting to maintain reliable classroom demonstrations.",
        "Guided students through hands-on projects, fostering early STEM interest and practical problem-solving skills.",
      ],
    },
    {
      role: "Embedded Programmer",
      organization: "Abarobotics",
      location: "Semarang, Indonesia",
      startDate: "2025-01",
      endDate: "2025-05",
      highlights: [
        "Developed firmware libraries for TM200 and CTI809 devices in Go language, enabling seamless integration with embedded control systems on Raspberry PI Platform.",
        "Optimized binary program size by 80%, improving memory efficiency and execution speed on resource-constrained hardware.",
        "Automated remote-device tasks using Bash scripting, streamlining deployment and maintenance.",
        "Designed and developed embedded systems using C and Go on microcontrollers and Raspberry Pi platforms.",
      ],
    },
    {
      role: "FPGA Engineer (Internship)",
      organization: "PT Len Industri (Persero)",
      location: "Bandung, Indonesia",
      startDate: "2024-02",
      endDate: "2024-06",
      highlights: [
        "Developed and tested Amplitude Modulation (AM) on an Embedded Linux platform using C.",
        "Implemented digital modulation schemes, Binary Phase Shift Keying (BPSK) and Quadrature Phase Shift Keying (QPSK) using Verilog HDL.",
        "Integrated custom IP cores and HDL reference designs for the AD9364 radio-frequency transceiver.",
        "Established high-speed communication between FPGA and ARM processors via Block RAM and the AXI4-Lite protocol.",
        "Built a Python/Tkinter GUI to configure radio-frequency chip parameters, enabling quick lab testing.",
      ],
    },
    {
      role: "Instrument and Control System Engineer (Internship)",
      organization: "PT Nusa Halmahera Minerals",
      location: "Maluku, Indonesia",
      startDate: "2024-01",
      endDate: "2024-02",
      highlights: [
        "Developed a PID calculator GUI using Python and Tkinter, allowing engineers to quickly tune control-loop parameters for on-site process systems.",
        "Analyzed process-control data to identify performance trends and recommend tuning adjustments for improved system stability.",
        "Documented system configurations and test procedures, streamlining future maintenance and audits.",
        "Performed maintenance, calibration, and troubleshooting of industrial sensors and actuators, ensuring accurate measurements and reliable plant operations.",
        "Configured and calibrated industrial sensors and actuators to ensure accurate real-time measurements in mining operations.",
      ],
    },
    {
      role: "Digital Signal Processing Lab Work Assistant",
      organization: "Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      startDate: "2023-10",
      endDate: "2023-12",
      highlights: [
        "Led three laboratory sessions covering frequency spectrum analysis and filter implementation, FIR design and windowing using Python, and DAC/ADC conversion on the STM32 Nucleo-F446RE development board.",
        "Implemented Fast Fourier Transform (FFT) algorithms to convert signals from the time domain to the frequency domain.",
        "Designed and tested digital filters including low-pass, high-pass, band-pass, and band-stop.",
        "Applied windowing techniques such as Triangular, Hann, Hamming, and Blackman to improve spectral analysis.",
      ],
    },
    {
      role: "Basic Electronics Lab Work Assistant",
      organization: "Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      startDate: "2023-10",
      endDate: "2023-12",
      highlights: [
        "Led laboratory sessions on instrumentation amplifiers, AC–DC converter regulators, and phase-shift oscillators, guiding students through circuit design and analysis.",
        "Built and demonstrated a full-bridge wave rectifier with an LM317 voltage regulator to provide a stable voltage source for experimental circuits.",
        "Utilized NI ELVIS II workstations to prototype and test a variety of analog and digital electronic circuits.",
        "Implemented NI LabVIEW interfaces for automated data acquisition using digital multimeters and oscilloscopes.",
      ],
    },
    {
      role: "Telecommunication Lab Work Assistant",
      organization: "Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      startDate: "2023-10",
      endDate: "2023-12",
      highlights: [
        "Led laboratory sessions on asynchronous serial communication, digital modulation, and digital communication for undergraduate students.",
        "Conducted experiments in analog and digital modulation, including amplitude modulation (AM) and binary phase-shift keying (BPSK), and guided students through setup, measurement, and analysis.",
      ],
    },
    {
      role: "Differential Equation Lecture Teaching Assistant",
      organization: "Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      startDate: "2022-02",
      endDate: "2022-06",
      highlights: [
        "Assisted in instruction for an undergraduate Differential Equations course, supporting lectures and grading assignments.",
        "Led weekly study sessions for a group of 8–10 students, reinforcing key concepts and guiding problem-solving techniques.",
        "Provided one-on-one tutoring to help students improve analytical skills and succeed in assessments.",
      ],
    },
  ],
  education: [
    {
      degree: "Short-Term Exchange Program",
      institution: "Ehime University",
      location: "Matsuyama, Japan",
      period: "Oct 2024 – Nov 2024",
      highlights: [
        "Conducted research on Large Language Model (LLM)–based lie detection, using Statement Accuracy Prediction (SAPLMA) and Training of Truth and Polarity Direction (TTPD).",
        "Participated in Japanese language and culture immersion activities, enhancing cross-cultural communication skills.",
      ],
    },
    {
      degree: "Bachelor Degree in Electrical Engineering",
      institution: "Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      period: "Sep 2020 – Oct 2024",
      highlights: [
        "Silver Medal, 35th National Student Scientific Week (PIMNAS), Ministry of Education (2022).",
        "Hands-on internships as FPGA Engineer and Instrument & Control System Engineer.",
        "Active member, Electrical Engineering & Information Technology Student Association; organized department-wide engineering events.",
      ],
    },
  ],
  certifications: [
    {
      name: "Verilog HDL Advanced",
      issuer: "Intel",
      date: "2024",
    },
    {
      name: "DeepLearning.AI TensorFlow Developer",
      issuer: "Coursera",
      date: "2023",
    },
    {
      name: "Mathematics for Machine Learning",
      issuer: "Coursera",
      date: "2023",
    },
  ],
  awards: [
    {
      name: "JASSO Short-Term Scholarship at Ehime University",
      issuer: "Japan Student Services Organization",
      year: "2024",
      description:
        "Awarded a scholarship for academic excellence and participation in the Short-Term Exchange Program.",
    },
    {
      name: "KATETIGAMA Scholarship Awardee",
      issuer: "KATETIGAMA",
      year: "2023",
      description: "Scholarship granted for good academic performance and extracurricular contributions.",
    },
    {
      name: "2nd Place, National Higher Student Competition (PIMNAS 35)",
      issuer: "Ministry of Education, Republic of Indonesia",
      year: "2022",
      description: "Recognized for outstanding research and innovation in a national higher-education competition.",
    },
    {
      name: "Finalist, National Essay Competition",
      issuer: "Semarang State University, Indonesia",
      year: "2022",
    },
    {
      name: "Karya Salemba Empat Scholarship Awardee",
      issuer: "Karya Salemba Empat Foundation",
      year: "2022",
    },
    {
      name: "Best Paper, National Essay Competition LEON",
      issuer: "Faculty of Social and Political Sciences Research Board, Brawijaya University",
      year: "2020",
    },
  ],
  volunteering: [
    {
      role: "Community Service Leader",
      organization: "KKN-PPM UGM, Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      year: "2023",
      highlights: [
        "Led a multidisciplinary student team to deliver community development programs, coordinating local partnerships and implementing technology-driven solutions.",
      ],
    },
    {
      role: "Staff of Public Relations",
      organization: "PKM Center, Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      year: "2023",
      highlights: [
        "Supported communication efforts and public outreach for the Student Creativity Program (PKM) Center, helping to promote events and increase student engagement with university-wide initiatives.",
        "Acted as a primary point of contact for student inquiries, providing key information and guidance on program regulations, deadlines, and events.",
        "Facilitated communication between students and program coordinators, ensuring a smooth flow of information and a positive experience for all participants.",
      ],
    },
    {
      role: "Coordinator of Robotics Division",
      organization: "Technocorner, Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      year: "2022",
      highlights: [
        "Directed the robotics competition division of a national technology event, organizing participant registration, technical requirements, and event operations.",
      ],
    },
    {
      role: "Staff of Resource Management",
      organization: "Karya Salemba Empat Association, Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      year: "2022",
      highlights: [
        "Oversaw resource management for the association, maintaining a precise inventory of materials and optimizing their use to support various internal community initiatives and events.",
      ],
    },
    {
      role: "Coordinator, IT Division",
      organization: "Festival Gadjah Mada, Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      year: "2022",
      highlights: [
        "Oversaw the planning and execution of IT operations for a large-scale university festival, managing technical logistics and on-site support.",
      ],
    },
    {
      role: "Staff of Robotics Division",
      organization: "Universitas Gadjah Mada",
      location: "Yogyakarta, Indonesia",
      year: "2021",
      highlights: [
        "Handled technical requirements and event operations for the transporter sub-event of a robotics competition.",
      ],
    },
  ],
  languages: [
    { name: "Indonesian", level: "Native" },
    { name: "English", level: "Business" },
    { name: "Japanese", level: "N5" },
  ],
  interests: [
    "Embedded Systems",
    "FPGA & Digital Design",
    "Robotics Education",
    "Machine Learning",
    "RISC-V Architecture",
  ],
};
