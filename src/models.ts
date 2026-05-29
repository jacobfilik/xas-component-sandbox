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

export interface BlueapiResponse {
  data: {
    id: string;
    attributes: {
      ancestors: unknown[];
      structure_family: string;
      specs: {
        name: string;
        version: string;
      }[];
      metadata: {
        start: StartMetadata;
        stop: StopMetadata;
      };
    };
  };
}

export interface StartMetadata {
  uid: string;
  time: number;
  user: string;
  scan_id: number;
  versions: {
    ophyd: string;
    bluesky: string;
    event_model: string;
    ophyd_async: string;
  };
  plan_args: {
    edge?: string;
    element?: string;
    angle?:unknown[];
    detectors?: string[];
    number_of_sweeps?: number| string;
    time_per_sweep?: number | string;
    [key: string]: any; // allow extra plan args
  };
  plan_name: string;
  plan_type: string;
  scan_file: string;
  instrument: string;
  instrument_session: string;
  data_session_directory: string;
  detector_file_template: string;
}

export interface StopMetadata {
  uid: string;
  time: number;
  reason: string;
  run_start: string;
  num_events: {
    primary: number;
    [key: string]: number;
  };
  exit_status: string;
}