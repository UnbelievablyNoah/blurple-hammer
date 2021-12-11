import { Subserver } from "..";

const subserver: Subserver = {
  id: "540758383582511115",
  name: "Blurple Asset Resource Facility",
  acronym: "BARF",

  staffAccess: {
    "443013283977494539": { // Blurple Administration
      access: "ALLOWED",
      roles: [
        "708630517528002581", // super admon
        "559336076456755200", // Blurple Executive
      ]
    },
    "413213839866462220": { // Blurple Executive
      access: "ALLOWED",
      roles: [
        "559336076456755200", // Blurple Executive
      ]
    },
    "708540954302218311": { // Blurple Production (Developer/Creative)
      access: "ALLOWED",
      roles: [
        "799262919111344128", // Creative Team
      ]
    }
  }
};

export default subserver;