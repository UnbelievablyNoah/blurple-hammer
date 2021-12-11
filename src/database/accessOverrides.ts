import { createDatabase } from ".";

export type OverrideData = {
  subserver: string;
  executive: string;
  timestamp: string;
};

export default createDatabase<Array<OverrideData>>("accessOverrides");