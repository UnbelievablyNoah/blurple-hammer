import { Subserver } from "..";

const subserver: Subserver = {
  id: "559341262302347314",
  name: "Blurple Application Development",
  acronym: "BAD",

  staffAccess: {
    "443013283977494539": { // Blurple Administration
      access: "ALLOWED",
      roles: [
        "559351138034647070", // Blurple Management
      ]
    },
    "413213839866462220": { // Blurple Executive
      access: "ALLOWED",
      roles: [
        "559351138034647070", // Blurple Management
      ]
    },
    "470272155876065280": { // Executive Assistant
      access: "ALLOWED",
      roles: [
        "559351138034647070", // Blurple Management
      ]
    },
    "708540954302218311": { // Blurple Production (Developer/Creative)
      access: "ALLOWED",
      roles: [
        "559815628953878551", // Blurple Developer
      ]
    }
  }
};

export default subserver;