import React, { useState } from "react";

import {
  defaultWorkflowConnection,
  initialWorkflowQuery,
  emptyWorkflowQuery,
} from "./defaults";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, type SetStateAction } from "react";

import type { VisitInput } from "../__generated__/graphql";
import type { WorkflowContextType } from "../models";
import type { WorkflowQuery, WorkflowQueryVariables } from "./WorkflowsData/__generated__/TaskFragments.generated";

const WorkflowContext = createContext<WorkflowContextType>({
  workflowData: emptyWorkflowQuery,
  currentVisit: defaultWorkflowConnection,
  setCurrentVisit: function (_: SetStateAction<{ visit: VisitInput; }>): void {
    throw new Error("Function not implemented.");
  },
  setWorkflowData: function (_: SetStateAction<WorkflowQuery>): void {
    throw new Error("Function not implemented.");
  },
  templateFilter: "SPECTROSCOPY",
  setTemplateFilter: function (_: SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  },
  tiledId: "",
  setTiledId: function (_: React.SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  }
})

function WorkflowsProvider(props: { children: React.ReactNode }) {
  const { children } = props;

  const [currentVisit, setCurrentVisit] = useState<WorkflowQueryVariables>(
    defaultWorkflowConnection,
  );

  const [tiledId, setTiledId] = useState<string>("")

  const [templateFilter, setTemplateFilter] = useState<string>("SPECTROSCOPY");


  const [workflowData, setWorkflowData] =
    useState<WorkflowQuery>(initialWorkflowQuery);

  return (
    <WorkflowContext.Provider
      value={{
        currentVisit: currentVisit,
        setCurrentVisit: setCurrentVisit,
        tiledId: tiledId,
        setTiledId: setTiledId,
        workflowData: workflowData,
        setWorkflowData: setWorkflowData,
        templateFilter: templateFilter,
        setTemplateFilter: setTemplateFilter,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export { WorkflowContext, WorkflowsProvider };
