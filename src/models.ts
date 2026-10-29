import type { ErrorLike } from "@apollo/client";
import type { WorkflowQuery } from "./workflows/WorkflowsData/__generated__/WorkflowQuery.generated";
import type { Visit, VisitInput } from "./__generated__/graphql";
import type { JsonSchema, UISchemaElement } from "@jsonforms/core";

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

export interface TiledResponse {
  data: TiledData[];
  error: unknown;
  links: unknown;
  meta: unknown;
}

export interface TilePageCount {
  count: number;
}

export interface TiledSearchMetadata {
  start: { plan_name: string; time: number; scan_id: number };
  stop?: unknown;
}

export interface TiledEntryInfo {
  id: string;
  running: boolean;
}

export interface TiledSearchData {
  id: string;
  attributes: { metadata: TiledSearchMetadata };
}

export interface TiledSearchResponse {
  data: TiledSearchData[];
  error: unknown;
  links: unknown;
  meta: TilePageCount;
}

export interface TiledData {
  id: string;
  attributes: Attributes;
  links: Record<string, string>;
  meta: any;
}

export interface Attributes {
  ancestors: string[];
  structure_family?: any;
  specs: Spec[];
  metadata: Metadata;
  structure: {
    contents: any;
    count: number;
  };
  access_blob: {
    tags: string[];
  };
  sorting: {
    key: string;
    direction: number;
  }[];
  data_sources: any;
}

export interface Spec {
  name: string;
  version: string | null;
}

export interface Metadata {
  uid: string;
  time: number;
  hints: Record<string, { fields: string[] }>;
  data_keys: Record<string, DataKey>;
  configuration: Record<string, Configuration>;
}

export interface DataInfo {
  datasetName: string;
  datasetContainerName: string;
  internal: boolean;
}

export interface DataKey {
  dtype: any;
  shape?: number[] | string;
  units?: string;
  external?: string;
  limits?: Limits;
  source: string;
  precision?: number;
  dtype_numpy: string;
  object_name?: string;
}

export interface Limits {
  control: {
    low: number;
    high: number;
  };
  display: {
    low: number;
    high: number;
  };
}

export interface Configuration {
  data: Record<string, number | string>;
  data_keys: Record<string, DataKey>;
  timestamps: Record<string, number>;
}

export interface WorkflowQueryHandlerResponse {
  error: ErrorLike | undefined;
  loading: boolean;
  data: WorkflowQuery | undefined;
}

export interface WorkflowContextType {
  currentVisit: { visit: VisitInput };
  setCurrentVisit: React.Dispatch<React.SetStateAction<{ visit: VisitInput }>>;
  workflowData: WorkflowQuery;
  setWorkflowData: React.Dispatch<React.SetStateAction<WorkflowQuery>>;
  getVisitString(): string;
  templateFilter: string;
  setTemplateFilter: React.Dispatch<React.SetStateAction<string>>;
}

export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONValue[];

export interface WorkflowTemplateProps {
  title: string;
  maintainer: string;
  description?: string;
  repository?: string;
  parametersSchema: JsonSchema;
  parametersUISchema?: UISchemaElement;
  prepopulatedParameters?: JSONObject;
  visit?: Visit
  onSubmit: (visit:Visit, parameters:object) => void;
  parameterMessage?: React.JSX.Element;
}