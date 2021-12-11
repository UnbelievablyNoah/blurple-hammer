import { Subserver } from "..";

const subserver: Subserver = {
  id: "803645810549981244",
  name: "Blurple Innovative Development Environmental",
  acronym: "BIDE",

  staffAccess: {
    "443013283977494539": { // Blurple Administration
      access: "ALLOWED",
      roles: [
        "803646089696903209", // Blurple Management
        "803646289014423562", // Blurple Executive
      ]
    },
    "413213839866462220": { // Blurple Executive
      access: "ALLOWED",
      roles: [
        "803646289014423562", // Blurple Executive
      ]
    },
    "470272155876065280": { // Executive Assistant
      access: "ALLOWED",
      roles: [
        "803646635225645076", // Executive Assistant
      ]
    },
    "569015549225598976": { // Blurple Moderator
      access: "ALLOWED",
      roles: [
        "803646383600959489", // Blurple Moderator
      ]
    },
    "708540954302218311": { // Blurple Production (Developer/Creative)
      access: "ALLOWED",
      roles: [
        "803646824938340443", // Blurple Production (Developer/Creative)
      ]
    }
  }};

export default subserver;