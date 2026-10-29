import workflowdata from "../workflows/mocks/WorkflowQueryMock.json";
import templatedata from "../workflows/mocks/TemplateQueryMock.json";
import templateviewdata from "../workflows/mocks/TemplateViewMock.json";
import { graphql, HttpResponse } from "msw";
import type { ScienceGroup } from "../__generated__/graphql";

const graphEndpoint = graphql.link("/graph/graphql");

export const graphHandlers = [
  graphEndpoint.query("WorkflowQuery", ({ variables }) => {
    const proposal = `${variables.visit.proposalCode}${variables.visit.proposalNumber}-${variables.visit.number}`;

    try {
      const response = workflowdata.filter((obj) => obj.visit === proposal);

      return HttpResponse.json({ data: response[0].data });
    } catch {
      const response = workflowdata.filter((obj) => obj.visit === "empty");

      return HttpResponse.json({ data: response[0].data });
    }
  }),
  graphEndpoint.query("WorkflowTemplateQuery", ({ variables }) => {
    const filter: ScienceGroup = variables.filter.scienceGroup;
    try {
      const response = templatedata.filter((val) => val.filter == filter);
      return HttpResponse.json({ data: response[0].data });
    } catch {
      const response = templatedata.filter((val) => val.filter == "empty");
      return HttpResponse.json({ data: response[0].data });
    }
  }),

  graphEndpoint.query("TemplateViewQuery", ({ variables }) => {
    const templateName: string = variables.templateName;
    try {
      const response = templateviewdata.filter(
        (val) => val.templateName == templateName,
      );
      return HttpResponse.json({ data: response[0].data });
    } catch {
      const response = templateviewdata.filter(
        (val) => val.templateName == "empty",
      );
      return HttpResponse.json({ data: response[0].data });
    }
  }),
  graphEndpoint.mutation("TemplateViewMutation", ({ variables }) => {
    const templateName: string = variables.templateName;
    const visitStr: string = `${variables.visit.proposalCode}${variables.visit.proposalNumber}-${variables.visit.number}`;
    const workflowId = `${visitStr}:${templateName}-0abc`;
    // ^ workflow id's will have some random string appended to them.

    return HttpResponse.json({
      data: {
        submitWorkflowTemplate: {
          __typename: "Workflow",
          id: { workflowId },
          name: `${templateName}-0abc`,
        },
      },
    });
  }),
];
