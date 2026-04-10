// Expose a small registry of projects for the template page to read.
// Add/edit entries here; keys should match the `id` used in the URL (?id=...).
window.PROJECTS = {
  "chess": {
    title: "Chess Client",
    subtitle: "User-friendly chess client built with JavaFX",
    hero: "/assets/projects/chess/hero.png", // optional image path: "/assets/projects/fpga-eq/hero.jpg"
    tags: ["Java", "JavaFX"],
    links: [
      { label: "GitHub", href: "#", kind: "code" },
      { label: "Design Notes (PDF)", href: "#", kind: "doc" }
    ],
    summary: "Simple one-window application built with java ",
    details: [
      //"Fixed-point biquad IIR sections with coefficient quantization.",
      //"Streamed audio path with AXI-Stream; testbench verifies magnitude response.",
      //"Resource utilization and timing closure validated with synthesis reports."
    ],
    tech: [
      "Java", "JavaFX", "Eclipse IDE"
    ],
    gallery: [
      // Optional image list: "/assets/projects/fpga-eq/bode.png"
      "/assets/projects/chess/puzzle1.png",
      "/assets/projects/chess/puzzle2.png",
      "/assets/projects/chess/puzzle3.png",
      "/assets/projects/chess/puzzle4.png",
      "/assets/projects/chess/puzzle5.png",
    ]
  },

  "spelling": {
    title: "Python Based Spelling Screener",
    subtitle: "Automated file parser for analyzing student spelling tests aiding in the diagnosis of dyslexia.",
    hero: "",
    tags: ["Python", "OpenPYXL", "Excel"],
    links: [
      { label: "GitHub", href: "https://github.com/mcelroymichael/spellingscreener", kind: "code" }
    ],
    summary: "Python based tool that runs locally to aid in grading spelling tests.",
    details: [
      "Features 11 filters that run on a per-word basis to detect the specific error in spelling.",
      "Integrates the OpenPYXL library to automate the parsing of Microsoft excel files with no human intervention.",
      "User friendly with simple steps to operate. Outputs an easy to read results.xlsx file with per-student grading."
    ],
    tech: ["Python", "OpenPYXL", "Microsoft Excel", "Pycharms"]
  },

  "power-supply": {
    title: "Custom Split ±35V Power Supply",
    subtitle: "Custom power supply that will later be used to power an audio amp.",
    //hero: "/assets/projects/chess/hero.png", // optional image path: "/assets/projects/fpga-eq/hero.jpg"
    tags: ["Java", "JavaFX"],
    links: [
      //{ label: "GitHub", href: "#", kind: "code" },
      { label: "ESP Website", href: "https://sound-au.com/", kind: "link" }
    ],
    summary: "Custom Split ±35V Power Supply designed to power an 80W Audio Amplifier.",
    details: [
      "Following an article on the ESP website, I currently have a digital schematic of the power supply in KiCad. I've also picked out the "+
      "necessary parts from DigiKey. My next step will be to find footprints for all of my components in order to create the actual pcb layout. "+
      "The project is looking to be very expensive with my current parts total at around $140. I'm still planning to follow through regardless "+
      "because it's necessary to make the audio amp that I've been itching to build. Plus, it will be a good opportunity to learn something about "+
      "power electronics.",
      //"Streamed audio path with AXI-Stream; testbench verifies magnitude response.",
      //"Resource utilization and timing closure validated with synthesis reports."
    ],
    tech: [
      "KiCad", "Power Electronics"
    ],
    gallery: [
      // Optional image list: "/assets/projects/fpga-eq/bode.png"
      "/assets/projects/power-supply/Rev0Schematic.png",
    ]
  }
/*
  "line-follower": {
    title: "Line-Following Robot!!!PLACEHOLDER!!!",
    subtitle: "PID control using IR reflectance array and velocity profiling",
    hero: "",
    tags: ["Arduino", "PID", "Control"],
    links: [{ label: "Code", href: "#", kind: "code" }],
    summary: "A compact robot that follows a track using closed-loop PID with manual and Ziegler-Nichols tuning.",
    details: [
      "IR sensor array for line position estimation (weighted average).",
      "Anti-windup and derivative filtering for stability.",
      "Velocity profile ramps to minimize slip on curves."
    ],
    tech: ["Arduino C++", "CAD for chassis", "3D printing", "Li-ion power"]
  }*/
};
