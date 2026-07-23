import type { AxiosResponse } from "axios";
import type {
  DeviceResponse,
  PlansResponse,
  TaskListItem,
  TaskListResponse,
  TiledResponse,
  TiledSearchResponse,
} from "./models";
import axios from "axios";

const blueapi = "/blueapi";
const plans = "/plans";
const tasks = "/tasks";
const devices = "/devices";
const worker = "/worker";
const task = "/task";
const tiled = "/tiled";
const user = "oauth2/userinfo";

export const getPlans = async () => {
  const { data } = await axios.get<PlansResponse, AxiosResponse<PlansResponse>>(
    blueapi + plans
  );
  return data;
};

export const postPlan = async (input: object) => {
  const response = await axios.post(blueapi + tasks, input);

  if (response.status != 201) {
    throw new Error("Failed to submit task");
  }

  return response.data;
};

export const getMetadata = async (taskId: string): Promise<TiledResponse> => {
  const response = await axios.get<TiledResponse>(
    tiled + "/metadata/" + taskId + "/primary"
  );
  if (response.status != 200) {
    throw new Error("Failed to retrieve metadata");
  }
  return response.data;
};

interface UserInfo {
  preferredUsername: string;
}

export const getUser = async () => {
  const response = await axios.get<UserInfo, AxiosResponse<UserInfo>>(user);
  if (response.status != 200) {
    throw new Error("Failed to get user info");
  }
  return response.data.preferredUsername;
};

export const getDevices = async () => {
  const { data } = await axios.get<
    DeviceResponse,
    AxiosResponse<DeviceResponse>
  >(blueapi + devices);
  return data;
};

export const getTasks = async () => {
  const { data } = await axios.get<
    TaskListResponse,
    AxiosResponse<TaskListResponse>
  >(blueapi + tasks);
  return data;
};

export const putTask = async (input: object) => {
  const response = await axios.put(blueapi + worker + task, input);

  if (response.status != 200) {
    throw new Error("Failed to activate task");
  }

  return response.data;
};

export const getTask = async (taskId: string) => {
  const response = await axios.get<TaskListItem, AxiosResponse<TaskListItem>>(
    blueapi + tasks + "/" + taskId
  );

  if (response.status != 200) {
    throw new Error("Failed to retrieve task");
  }

  return response.data;
};

export const getRunsInVisit = async (
  visit: string,
  offset: number,
  limit: number,
  sort_key: string
): Promise<TiledSearchResponse> => {
  const response = await axios.get<TiledSearchResponse>(
    tiled +
      "/search/?filter[eq][condition][key]=start.instrument_session&filter[eq][condition][value]=%22" +
      visit +
      "%22" +
      "&page[offset]=" +
      offset +
      "&page[limit]=" +
      limit +
      "&sort=" +
      sort_key
  );
  if (response.status != 200) {
    throw new Error("Failed to retrieve metadata");
  }
  return response.data;
};

export const getData = async (id: string, name: string) => {
  const response = await axios.get<number[]>(
    tiled +
      "/array/full/" +
      id +
      "/primary/internal/" +
      name +
      "?format=application/json"
  );
  if (response.status != 200) {
    throw new Error("Failed to retrieve data");
  }
  return response.data;
};
