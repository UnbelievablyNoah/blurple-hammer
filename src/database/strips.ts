import { createDatabase } from ".";

export type StripData = Array<string>;

export default createDatabase<StripData>("strips");