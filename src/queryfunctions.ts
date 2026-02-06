import type { AxiosResponse } from "axios";
import type { PlansResponse } from "./models";
import axios from "axios";

const blueapi = "/blueapi";
const plans = "/plans";
const tasks = "/tasks";

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
