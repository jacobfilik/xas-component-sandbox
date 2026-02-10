import type { AxiosResponse } from "axios";
import type { DeviceResponse, PlansResponse, TaskListResponse } from "./models";
import axios from "axios";

const blueapi = "/blueapi";
const plans = "/plans";
const tasks = "/tasks";
const devices = "/devices";
const worker = "/worker";
const task = "/task";

const user = "oauth2/userinfo";

export const getPlans = async () => {
  const { data } = await axios.get<PlansResponse, AxiosResponse<PlansResponse>>(
    blueapi + plans
  );
  return data;
};

export const postPlan = async (input: object) => {
  const response = await axios.post(blueapi + tasks, input);

  if (response.status != 200) {
    throw new Error("Failed to submit task");
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
