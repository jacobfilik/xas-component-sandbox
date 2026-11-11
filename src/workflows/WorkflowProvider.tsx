import React, { useState } from "react";

import {
  defaultWorkflowConnection,
  initialWorkflowQuery,
  emptyWorkflowQuery,
} from "./defaults";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, type SetStateAction } from "react";

import type { VisitInput } from "../__generated__/graphql";
import type { JSONObject, TiledEntryInfo, WorkflowContextType } from "../models";
import type {
  WorkflowQuery,
  WorkflowQueryVariables,
} from "./WorkflowsData/__generated__/TaskFragments.generated";

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
  tiledEntry: null,

  workflowParams: {},
  setWorkflowParams: function (_: React.SetStateAction<JSONObject>): void {
    throw new Error("Function not implemented.");
  },
  setTiledEntry: function (_: TiledEntryInfo | null): void {
    throw new Error("Function not implemented.");
  }
});

function WorkflowsProvider(props: { children: React.ReactNode }) {
  const { children } = props;

  const [currentVisit, setCurrentVisit] = useState<WorkflowQueryVariables>(
    defaultWorkflowConnection,
  );

  const [tiledEntry, _setTiledEntry] = useState<TiledEntryInfo | null>(null);

  const [templateFilter, setTemplateFilter] = useState<string>("SPECTROSCOPY");

  const [workflowParams, setWorkflowParams] = useState<JSONObject>({})
  // add beamline !

  const setTiledEntry = (val:TiledEntryInfo|null) => {
    _setTiledEntry(val)
    if (val){
      setWorkflowParams({...workflowParams, tiled_id:val.id})
      // console.log("changed id to: ", workflowParams.tiled_id)
    }
  }

  const [workflowData, setWorkflowData] =
    useState<WorkflowQuery>(initialWorkflowQuery);

  return (
    <WorkflowContext.Provider
      value={{
        currentVisit: currentVisit,
        setCurrentVisit: setCurrentVisit,
        tiledEntry: tiledEntry,
        setTiledEntry: setTiledEntry,
        workflowData: workflowData,
        setWorkflowData: setWorkflowData,
        templateFilter: templateFilter,
        setTemplateFilter: setTemplateFilter,
        workflowParams: workflowParams,
        setWorkflowParams: setWorkflowParams
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export { WorkflowContext, WorkflowsProvider };
