import workflowdata from "../workflows/mocks/WorkflowQueryMock.json";
import { graphql, HttpResponse } from "msw";

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
];
