import type { SVGProps } from "react";
import { Section } from "@/components/ui/section";

const interests = [
  {
    title: "Computer Architecture",
    description: "Processor design, pipelines, and instruction set architecture.",
    icon: CpuIcon,
  },
  {
    title: "Embedded & Digital System Design",
    description: "Microcontrollers, FPGAs, and digital logic design.",
    icon: CircuitIcon,
  },
  {
    title: "VLSI",
    description: "Digital and mixed-signal circuit design at the silicon level.",
    icon: LayersIcon,
  },
  {
    title: "Robotics",
    description: "Control systems, sensors, and autonomous machines.",
    icon: RobotIcon,
  },
];

export function Interests() {
  return (
    <Section title="Interests" index={1} className="border-t border-border">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {interests.map((interest, i) => (
          <div
            key={interest.title}
            className="border border-border bg-surface p-6 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <interest.icon className="h-6 w-6 text-accent" aria-hidden="true" />
              <span className="font-mono text-xs text-muted">
                [{String(i + 1).padStart(2, "0")}]
              </span>
            </div>
            <h3 className="mt-4 text-base font-semibold tracking-tight">{interest.title}</h3>
            <p className="mt-2 text-sm text-muted">{interest.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function iconProps(props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
  };
}

function CpuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect x="6" y="6" width="12" height="12" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
      <path d="M9 2v3.5M15 2v3.5M9 18.5V22M15 18.5V22M2 9h3.5M2 15h3.5M18.5 9H22M18.5 15H22" />
    </svg>
  );
}

function CircuitIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="4" width="18" height="15" rx="1" />
      <circle cx="8" cy="9.5" r="1.1" />
      <circle cx="16" cy="14.5" r="1.1" />
      <path d="M8 10.6V13h4v4M9.1 9.5h3.9v4M3 14h2M19 8h2" />
    </svg>
  );
}

function LayersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3 21 8l-9 5-9-5 9-5Z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </svg>
  );
}

function RobotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect x="5" y="8.5" width="14" height="11" rx="2" />
      <path d="M12 8.5V5" />
      <circle cx="12" cy="3.5" r="1.2" />
      <circle cx="9" cy="13.5" r="1" />
      <circle cx="15" cy="13.5" r="1" />
      <path d="M9 17h6M2 12v3M22 12v3" />
    </svg>
  );
}
