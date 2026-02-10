import { delay, http, HttpResponse } from "msw";
import type { DeviceResponse, TaskListResponse, TaskResponse } from "../models";

const mockPlans = {
  plans: [
    {
      name: "count",
      description:
        "Reads from a number of devices.\n    Wraps bluesky.plans.count(det, num, delay, md=metadata) exposing only serializable\n    parameters and metadata.",
      schema: {
        additionalProperties: false,
        properties: {
          detectors: {
            items: {
              enum: [
                "alignment_x",
                "alignment_y",
                "panda",
                "turbo_slit",
                "turbo_slit_x",
              ],
              type: "bluesky.protocols.Readable",
            },
            title: "Detectors",
            type: "array",
            uniqueItems: true,
          },
          num: {
            title: "Num",
            type: "integer",
          },
          delay: {
            anyOf: [
              {
                type: "number",
              },
              {
                items: {
                  type: "number",
                },
                type: "array",
              },
            ],
            title: "Delay",
          },
          metadata: {
            additionalProperties: true,
            title: "Metadata",
            type: "object",
          },
        },
        required: ["detectors"],
        title: "count",
        type: "object",
      },
    },
    {
      name: "count2",
      description:
        "Reads from a number of devices.\n    Wraps bluesky.plans.count(det, num, delay, md=metadata) exposing only serializable\n    parameters and metadata.",
      schema: {
        additionalProperties: false,
        properties: {
          detectors: {
            items: {
              enum: [
                "alignment_x",
                "alignment_y",
                "panda",
                "turbo_slit",
                "turbo_slit_x",
              ],
              type: "bluesky.protocols.Readable",
            },
            title: "Detectors",
            type: "array",
            uniqueItems: true,
          },
          num: {
            title: "Num",
            type: "integer",
          },
          delay: {
            anyOf: [
              {
                type: "number",
              },
              {
                items: {
                  type: "number",
                },
                type: "array",
              },
            ],
            title: "Delay",
          },
          metadata: {
            additionalProperties: true,
            title: "Metadata",
            type: "object",
          },
        },
        required: ["detectors"],
        title: "count",
        type: "object",
      },
    },
  ],
};

const mockDevices: DeviceResponse = {
  devices: [
    {
      name: "alignment_y",
      protocols: [
        {
          name: "Flyable",
          types: [],
        },
        {
          name: "Movable",
          types: [],
        },
        {
          name: "Readable",
          types: [],
        },
        {
          name: "Stageable",
          types: [],
        },
        {
          name: "Stoppable",
          types: [],
        },
        {
          name: "Subscribable",
          types: ["float"],
        },
        {
          name: "Configurable",
          types: [],
        },
        {
          name: "Device",
          types: [],
        },
      ],
    },
    {
      name: "turbo_slit",
      protocols: [
        {
          name: "Movable",
          types: ["float"],
        },
        {
          name: "Readable",
          types: [],
        },
        {
          name: "Stageable",
          types: [],
        },
        {
          name: "Configurable",
          types: [],
        },
        {
          name: "Device",
          types: [],
        },
      ],
    },
  ],
};

const mockTasks: TaskListResponse = {
  tasks: [
    {
      task_id: "c237509c-e939-48cf-812f-5bc1c5d825e8",
      task: {
        name: "step_scan",
        params: {
          detectors: ["turbo_slit_x"],
          motor: "turbo_slit_x",
          scan_args: [2, 5, 11],
        },
        metadata: {
          instrument_session: "cm44254",
        },
      },
      request_id: null,
      is_complete: true,
      is_pending: false,
      errors: [],
    },
  ],
};

export const handlers = [
  http.get("/user", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),

  http.get("/blueapi/plans", () => {
    return HttpResponse.json(mockPlans);
  }),

  http.get("/blueapi/tasks", () => {
    return HttpResponse.json(mockTasks);
  }),

  http.post("/blueapi/tasks", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const requestObject = await request.json();

    await delay(1000);

    console.log(requestObject);
    const response: TaskResponse = { task_id: "mock_task_id" };

    return HttpResponse.json(response);
  }),

  http.get("/blueapi/devices", () => {
    return HttpResponse.json(mockDevices);
  }),

  http.put("/blueapi/worker/task", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const requestObject = await request.json();

    await delay(1000);

    console.log(requestObject);

    return HttpResponse.json(requestObject);
  }),

  http.get("/oauth2/userinfo", () => {
    // return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({ preferredUsername: "test user" });
  }),
];
