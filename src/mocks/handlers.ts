import { delay, http, HttpResponse } from "msw";

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

  http.post("/blueapi/tasks", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const requestObject = await request.json();

    await delay(1000);

    console.log(requestObject);
    return new HttpResponse(null, { status: 200 });
  }),

  http.get("/oauth2/userinfo", () => {
    // return new HttpResponse(null, { status: 401 });
    return HttpResponse.json({ preferredUsername: "test user" });
  }),
];
