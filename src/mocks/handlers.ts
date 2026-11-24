import { delay, http, HttpResponse } from "msw";
import type {
  DeviceResponse,
  TaskListItem,
  TaskListResponse,
  TaskResponse,
  TiledResponse,
  TiledSearchResponse,
} from "../models";
import testdata from "../test_data.json";

import testsearch from "../test_search_response.json";
import { escapeFragment } from "ajv/dist/compile/util";

let dataCalls = 0;
let searchCalls = 0;

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

const mockTiledResponse: TiledResponse = testdata;

const mockPaginatedResponse: TiledSearchResponse = testsearch;

// mockPaginatedResponse.data.push(testsearch.data[0]);
// mockPaginatedResponse.data.push(testsearch.data[0]);
// mockPaginatedResponse.data.push(testsearch.data[0]);
// mockPaginatedResponse.data.push(testsearch.data[0]);
// mockPaginatedResponse.data.push(testsearch.data[0]);
// mockPaginatedResponse.data.push(testsearch.data[0]);
// mockPaginatedResponse.data.push(testsearch.data[0]);

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

  http.get("/blueapi/tasks/:id", () => {
    return HttpResponse.json(mockTasks.tasks[0]);
  }),

  http.post("/blueapi/tasks", async () => {
    // Read the intercepted request body as JSON.
    // const requestObject = await request.json();

    await delay(1000);
    const response: TaskResponse = { task_id: "mock_task_id" };

    return HttpResponse.json(response, { status: 201 });
  }),

  http.get("/blueapi/devices", () => {
    return HttpResponse.json(mockDevices);
  }),

  http.put("/blueapi/worker/task", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const requestObject = await request.json();

    await delay(1000);

    return HttpResponse.json(requestObject);
  }),

  http.get("/oauth2/userinfo", () => {
    // return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({ preferredUsername: "test user" });
  }),

  http.get("/tiled/search/p51/cm44254/cm44254-1/:id", () => {
    return HttpResponse.json(mockTiledResponse);
  }),

  http.get(
    "/tiled/search/p51/cm44254/cm44254-1/?filter[eq][condition][key]=start.blueapi_task_id&filter[eq][condition][value]=%22mock_task_id%22",
    () => {
      console.log(`SEARCH ${searchCalls}`);
      if (searchCalls == 0) {
        const mpr = { ...mockPaginatedResponse, data: [] };
        searchCalls++;
        return HttpResponse.json(mpr);
      }

      if (searchCalls < 7) {
        const mpr = {
          ...mockPaginatedResponse,
          data: [mockPaginatedResponse.data[0]],
        };
        searchCalls++;
        return HttpResponse.json(mpr);
      }

      const mpr = {
        ...mockPaginatedResponse,
        data: [mockPaginatedResponse.data[1]],
      };
      // searchCalls = 0;
      return HttpResponse.json(mpr);
    },
  ),

  http.get("tiled/search/p51/cm44254/cm44254-1", () => {
    // const url = new URL(request.url);

    // const key = url.searchParams.get("filter[eq][condition][key]");
    // const value = url.searchParams.get("filter[eq][condition][vale]");

    return HttpResponse.json(mockPaginatedResponse);
  }),

  http.get(
    "tiled/array/full/p51/cm44254/cm44254-1/:id/primary/internal/:name",
    () => {
      // const url = new URL(request.url);

      return HttpResponse.json(
        Array.from({ length: 100 + Math.floor(Math.random() * 500) }, () =>
          Math.random(),
        ),
      );
    },
  ),

  http.get("tiled/array/full/p51/cm44254/cm44254-1/:id/primary/:name", () => {
    // const url = new URL(request.url);

    if (dataCalls < 100) {
      dataCalls++;
    } else {
      dataCalls = 1;
    }

    return HttpResponse.json(
      Array.from(
        { length: dataCalls * 500 },
        (_value, index) => index + Math.random() * index,
      ),
    );
  }),
];
