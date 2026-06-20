/**
 * Project data, sourced from public/files/Yusron_Izza_Faradisa_CV.pdf.
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
      "A from-scratch RV32I processor in Verilog, with single-cycle and 5-stage pipelined implementations, hazard handling, and M-extension support.",
    longDescription: [
      "A from-scratch implementation of the RISC-V RV32I base integer instruction set in Verilog, built to explore processor microarchitecture beyond the textbook: a single-cycle datapath alongside a modular 5-stage pipeline (fetch, decode, execute, memory, write-back).",
      "The pipelined version handles data and control hazards directly — forwarding and stalling logic live in a dedicated hazard unit rather than being bolted onto the datapath — and the instruction set was extended with the M (multiply/divide) extension on top of the RV32I base.",
      "Every module — ALU, control unit, register file, hazard unit — is verified independently with its own testbench before integration, and the full core is validated against the RISC-V specification through simulation.",
    ],
    tags: ["Verilog", "RISC-V", "Computer Architecture"],
    role: "Personal Project",
    year: 2024,
    featured: true,
    links: {
      repo: "https://github.com/yusronizza/riscv",
    },
    highlights: [
      "Implemented the RV32I base integer ISA with both a single-cycle datapath and a 5-stage pipelined microarchitecture (IF/ID/EX/MEM/WB).",
      "Designed a dedicated hazard unit for data and control hazard detection, with forwarding and stalling to keep the pipeline correct under dependencies.",
      "Extended the ISA with the M (multiply/divide) extension on top of the RV32I base.",
      "Verified each module independently via testbenches, then validated the integrated core against the RISC-V specification through simulation.",
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
