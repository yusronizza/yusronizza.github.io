/**
 * Project data, sourced from public/Yusron_Izza_Faradisa_CV.pdf.
 * Add new entries here as new projects ship — listing and detail pages
 * are generated automatically from this array.
 */

export type Project = {
  slug: string;
  title: string;
  description: string;
  longDescription: string[];
  tags: string[];
  role: string;
  year: number;
  featured: boolean;
  links: {
    live?: string;
    repo?: string;
  };
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "risc-v-32i-microprocessor",
    title: "RISC-V 32I Base Integer Microprocessor",
    description:
      "A 32-bit RISC-V processor in Verilog, with single-cycle and pipelined architectures and M-extension support.",
    longDescription: [
      "A personal project to design and implement a 32-bit RISC-V processor in Verilog, providing both single-cycle and pipelined architectures.",
      "The instruction set was extended with the M (Multiply/Divide) extension to enhance functionality and performance, and verified through simulation and testbench development to ensure compliance with the RISC-V specification.",
    ],
    tags: ["Verilog", "RISC-V", "Computer Architecture"],
    role: "Personal Project",
    year: 2024,
    featured: true,
    links: {},
    highlights: [
      "Designed and implemented a 32-bit RISC-V processor in Verilog, providing both single-cycle and pipelined architectures.",
      "Extended the ISA with M (Multiply/Divide) instruction set extensions to enhance functionality and performance.",
      "Verified functionality through simulation and testbench development, ensuring compliance with the RISC-V specification.",
    ],
  },
];

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => b.year - a.year);
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((project) => project.slug);
}
