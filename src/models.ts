export interface Plan {
  name: string;
  description: string;
  schema: object;
}

export interface PlansResponse {
  plans: Plan[];
}

export interface Protocols {
  name: string;
  types: any[];
}

export interface Device {
  name: string;
  protocols: Protocols[];
}

export interface DeviceResponse {
  devices: Device[];
}

export interface TaskBase {
  name: string;
  params: object;
}

export interface Task extends TaskBase {
  metadata: object;
}

export interface TaskRequest extends TaskBase {
  instrument_session: string;
}

export interface TaskResponse {
  task_id: string;
}

export interface PersonResult {
  person: string | null | undefined;
  person_status: "PENDING" | "UNAUTHORIZED" | "FORBIDDEN" | "OK" | "ERROR";
}

export interface WorkerState {
  state:
    | "IDLE"
    | "RUNNING"
    | "PAUSING"
    | "PAUSED"
    | "HALTING"
    | "STOPPING"
    | "ABORTING"
    | "SUSPENDING"
    | "PANICKED"
    | "UNKNOWN";
}

export interface TaskListItem {
  task_id: string;
  task: Task;
  request_id: string | null;
  is_complete: boolean;
  is_pending: boolean;
  errors: string[];
}

export interface TaskListResponse {
  tasks: TaskListItem[];
}
