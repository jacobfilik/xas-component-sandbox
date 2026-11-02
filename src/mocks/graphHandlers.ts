import { graphql, HttpResponse } from "msw";
import type { ScienceGroup, WorkflowTemplate } from "../__generated__/graphql";

import workflowdata from "../workflows/mocks/WorkflowQueryMock.json";
import templatedata from "../workflows/mocks/WorkflowTemplateQueryMock.json";
import { emptyWorkflowTemplate } from "../workflows/defaults";
import { getVisitString } from "../queryfunctions";
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

  graphEndpoint.query("WorkflowTemplateViewQuery", ({ variables }) => {
    const templateName: string = variables.templateName;
    let response = emptyWorkflowTemplate;

    for (const val in templatedata) {
      const nodes = templatedata[val].data.workflowTemplates.nodes;
      for (const node in nodes) {
        if (nodes[node].name == templateName) {
          response = nodes[node] as WorkflowTemplate;
        }
      }
    }
    return HttpResponse.json({ data: { workflowTemplate: response } });
  }),

  graphEndpoint.mutation("TemplateViewMutation", ({ variables }) => {
    const templateName: string = variables.templateName;
    const visitStr = getVisitString(variables.visit);
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
