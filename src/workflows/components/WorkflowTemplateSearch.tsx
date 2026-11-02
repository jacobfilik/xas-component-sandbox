import {
  Stack,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Alert,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  AccordionActions,
} from "@mui/material";
import React, { useCallback, useContext, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useLazyQuery } from "@apollo/client/react";

import { WorkflowContext } from "../WorkflowProvider";
import { debounce } from "../../queryfunctions";
import { TemplateFilters } from "../defaults";
import type { WorkflowTemplateQuery } from "../WorkflowsData/__generated__/TemplateFragment.generated";
import type {
  ScienceGroup,
  WorkflowTemplate,
  WorkflowTemplatesFilter,
} from "../../__generated__/graphql";
import { WORKFLOW_TEMPLATE_QUERY } from "../WorkflowsData/TemplateFragment";

function ScienceGroupMenu(props: {
  getData: useLazyQuery.ExecFunction<
    WorkflowTemplateQuery,
    { filter?: WorkflowTemplatesFilter | null | undefined }
  >;
}) {
  const { templateFilter, setTemplateFilter } = useContext(WorkflowContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFilter, setCurrentFilter] = useState<string>(templateFilter);
  const open = Boolean(anchorEl);

  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(
    debounce((value: string) => {
      props.getData({
        variables: { filter: { scienceGroup: [value] as ScienceGroup[] } },
      });
    }, 200), [] );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Stack>
      <Paper>
        <List component={"nav"} aria-label="filter-options">
          <ListItemButton
            id="filter-button"
            aria-controls="filter-menu"
            aria-expanded={open}
            onClick={handleClick}
          >
            <ListItemText
              primary="Search Templates"
              secondary={currentFilter}
            />
          </ListItemButton>
        </List>
        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          slotProps={{
            list: { "aria-labelledby": "filter-button", role: "listbox" },
          }}
        >
          {TemplateFilters.map((option, idx) => (
            <MenuItem
              key={`${option}-${idx}`}
              selected={currentFilter === option}
              onClick={() => {
                setCurrentFilter(option);
                setAnchorEl(null);
                setTemplateFilter(currentFilter);
                onChange(option);
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    </Stack>
  );
}

function WorkflowTemplateViewer(props: {
  templates: WorkflowTemplateQuery;
  changeName: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Stack alignItems="center">
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="template-content"
          id="template-header"
        >
          <Typography variant="h6">
            Found {props.templates.workflowTemplates.nodes.length} templates
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {props.templates.workflowTemplates.nodes.map((val, idx) => (
            <Stack key={`${idx}-template`} width="100%">
              <SingleTemplateView
                template={val as WorkflowTemplate}
                changeName={props.changeName}
              />
            </Stack>
          ))}
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}

export function WorkflowTemplateSearch(props: {
  changeName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [getTemplates, { error, data }] = useLazyQuery(WORKFLOW_TEMPLATE_QUERY);

  return (
    <Stack height={"100%"} width={"100%"} spacing={1}>
      <ScienceGroupMenu getData={getTemplates} />

      {error && <Alert severity="error">{error.message}</Alert>}
      {data && (
        <Stack>
          <WorkflowTemplateViewer
            templates={data}
            changeName={props.changeName}
          />
        </Stack>
      )}
    </Stack>
  );
}

function SingleTemplateView(props: {
  template: WorkflowTemplate;
  changeName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const name = props.template.name;
  const title = props.template.title ? props.template.title : name;

  return (
    <Stack key={`${name}-singleview`} width="100%">
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls={`${name}-content`}
          id={`${name}-header`}
        >
          <Stack direction="row" alignItems={"center"} spacing={4}>
            <Typography align="center" alignItems="center" variant="button">
              {title}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">{props.template.description}</Typography>
        </AccordionDetails>
        <AccordionActions>
          <Button onClick={() => props.changeName(props.template.name)}>
            <Typography variant="body2">View Template Parameters</Typography>
          </Button>
        </AccordionActions>
      </Accordion>
    </Stack>
  );
}
