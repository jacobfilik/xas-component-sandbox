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
} from "@mui/material";
import React, { useCallback, useContext, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useLazyQuery } from "@apollo/client/react";
import type { WorkflowTemplateQuery } from "../WorkflowsData/__generated__/WorkflowTemplateQuery.generated";
import type {
  ScienceGroup,
  WorkflowTemplate,
  WorkflowTemplatesFilter,
} from "../../__generated__/graphql";
import { WorkflowContext } from "../WorkflowProvider";
import { debounce } from "../../queryfunctions";
import { TemplateFilters } from "../defaults";
import { WORKFLOW_TEMPLATE_QUERY } from "../WorkflowsData/WorkflowTemplateQuery";

function FilterMenu(props: {
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
    }, 200),
    [],
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Stack>
      <Paper>
        <List component={"nav"} aria-label="filter-options">
          <ListItemButton
            id="filter-button"
            aria-control="filter-menu"
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
          {TemplateFilters.map((option) => (
            <MenuItem
              key={option}
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

export function WorkflowTemplateSearch(props: {
  changeName: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [getTemplates, { error, data }] = useLazyQuery(WORKFLOW_TEMPLATE_QUERY);

  return (
    <Stack height={"100%"} width={"100%"} spacing={1}>
      <FilterMenu getData={getTemplates} />
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

function WorkflowTemplateViewer(props: {
  templates: WorkflowTemplateQuery;
  changeName: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Stack alignItems={"center"}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls={"template-content"}
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

function SingleTemplateView(props: {
  template: WorkflowTemplate;
  changeName: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <Stack key={`${props.template.name}-view`} width={"100%"}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls={`${props.template.name}-content`}
          id={`${props.template.name}-header`}
        >
          {props.template.title && (
            <Stack direction="row" alignItems={"center"} spacing={4}>
              <Typography align="center" variant="button">
                {props.template.title}
              </Typography>
              <Button onClick={() => props.changeName(props.template.name)}>
                <Typography variant="body2">
                  View Template Parameters
                </Typography>
              </Button>
            </Stack>
          )}
          {!props.template.title && (
            <Stack direction="row" alignItems={"center"} spacing={4}>
              <Typography align="center" variant="button">
                {props.template.name}
              </Typography>
              <Button onClick={() => props.changeName(props.template.name)}>
                <Typography variant="body2">
                  View Template Parameters
                </Typography>
              </Button>
            </Stack>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">{props.template.description}</Typography>
        </AccordionDetails>
      </Accordion>
    </Stack>
  );
}
