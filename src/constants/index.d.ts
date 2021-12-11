export type Restriction = {
  name: string,
  description: string,
  allowed: string,
  disallowed: string,
  role: string,
};

export type Subserver = {
  id: string,
  name: string,
  acronym: string,

  staffAccess: Record<string, SubserverStaffAccess>,
}

export type AccessLevel = "ALLOWED" | "FORCED";

type SubserverStaffAccess = {
  access: AccessLevel,
  roles: Array<string>,
}