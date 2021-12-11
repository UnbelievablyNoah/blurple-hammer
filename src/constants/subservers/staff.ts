import { Subserver } from "..";

const subserver: Subserver = {
  id: "573169434227900417",
  name: "Blurple Analogous Staff Environment",
  acronym: "BASE",

  staffAccess: {
    "443013283977494539": { // Blurple Administration
      access: "FORCED",
      roles: [
        "573193684296925204", // Executive Administration
        "573176976454713344", // Executive
      ]
    },
    "413213839866462220": { // Blurple Executive
      access: "FORCED",
      roles: [
        "573176976454713344", // Executive
      ]
    },
    "470272155876065280": { // Executive Assistant
      access: "FORCED",
      roles: [
        "573176977045979147", // Executive Assistant
      ]
    },
    "569015549225598976": { // Blurple Moderator
      access: "FORCED",
      roles: [
        "573176977683644450", // Moderator
      ]
    },
    "442785212502507551": { // Blurple Helper
      access: "FORCED",
      roles: [
        "573177050077069325", // Helper
      ]
    },
    "708540954302218311": { // Blurple Assistant (Developer/Creative)
      access: "ALLOWED",
      roles: []
    }
  }
};

export default subserver;