export interface Plan {
  name: string;
  description: string;
  schema: object;
}

export interface PlansResponse {
  plans: Plan[];
}

export interface PersonResult {
  person: string | null | undefined;
  person_status: "PENDING" | "UNAUTHORIZED" | "FORBIDDEN" | "OK" | "ERROR";
}
