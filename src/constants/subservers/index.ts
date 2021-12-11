import { AccessLevel, Subserver } from "..";
import fs from "fs";

const subservers: Array<Subserver> = fs.readdirSync(__dirname).map(file => require(file)).map(imported => imported.default);

export default subservers;

export const accessLadder: Record<AccessLevel, number> = {
  "FORCED": 2,
  "ALLOWED": 1,
};