import {
  getDomain,
  Toolbar,
  ToggleBtn,
  VisCanvas,
  DefaultInteractions,
  TooltipMesh,
  ResetZoomButton,
  DataCurve,
  type Domain,
} from "@h5web/lib";
import "@h5web/lib/dist/styles.css";

import Paper from "@mui/material/Paper";
import { MdGridOn } from "react-icons/md";

import { Typography, useTheme, type Theme } from "@mui/material";
import { type ReactElement, useState } from "react";

import ndarray from "ndarray";
import { Box } from "@mui/material";

// function CurveOption(props: { option: CurveType }) {
//   const { option } = props;

//   return (
//     <div>
//       <span>{String(option)}</span>
//     </div>
//   );
// }

export function DataChart(props: { data: number[] | null }) {
  // const curveOptions: CurveType[] = Object.values(
  //   CurveType
  // ) as Array<CurveType>;

  const [useGrid, setUseGrid] = useState(true);
  // const [curveOption, setCurveOption] = useState(curveOptions[0]);

  const theme: Theme = useTheme();

  const ydata = props.data ? ndarray(props.data) : null;
  const xdata =
    props.data != null
      ? ndarray(Array.from(Array(props.data.length).keys()))
      : null;

  //   if (props.xas.stk_energy && props.xas.stk_xas) {
  //     xdata2 = ndarray(props.xas.stk_energy, [props.xas.stk_energy.length]);
  //     ydata2 = ndarray(props.xas.stk_xas, [props.xas.stk_xas.length]);
  //   }

  const toolbarstyle = {
    "--h5w-toolbar--bgColor": theme.palette.action.hover,
    "--h5w-tickLabels--color": theme.palette.text.primary,
    "--h5w-ticks--color": theme.palette.text.primary,
    "--h5w-grid--color": "black",
    "--h5w-toolbar-label--color": theme.palette.primary.dark,
    "--h5w-btn-hover--bgColor": theme.palette.action.hover,
    "--h5w-btnPressed--bgColor": theme.palette.action.selected,
    "--h5w-selector-menu--bgColor": theme.palette.background.default,
    "--h5w-selector-option-selected--bgColor": theme.palette.action.selected,
  } as React.CSSProperties;

  const plotstyle = {
    "--h5w-tickLabels--color": theme.palette.text.primary,
    "--h5w-ticks--color": theme.palette.text.primary,
    "--h5w-grid--color": theme.palette.text.secondary,
    "--h5w-axisLabels--color": theme.palette.text.primary,
    "--h5w-line--color": theme.palette.primary.dark,
    "--h5w-line--colorAux": [
      theme.palette.success.light,
      theme.palette.secondary.dark,
    ],
  } as React.CSSProperties;

  const tooltipText = (x: number, y: number): ReactElement<string> => {
    return (
      <p>
        {x.toPrecision(8)}, {y.toPrecision(8)}
      </p>
    );
  };

  let domain: Domain | undefined = ydata ? getDomain(ydata) : [0, 1];
  let domainx: Domain | undefined = xdata ? getDomain(xdata) : [0, 1];

  domain = domain ? domain : [0, 1];
  domainx = domainx ? domainx : [0, 1];

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme: Theme) => theme.palette.background.default,
        fontFamily: (theme: Theme) => theme.typography.fontFamily,
      }}
    >
      <Typography>
        {props.data ? "Data size: " + props.data.length : "No data"}
      </Typography>
      <Box style={toolbarstyle}>
        <Toolbar>
          <ToggleBtn
            label="Grid"
            value={useGrid}
            Icon={MdGridOn}
            onToggle={() => setUseGrid(!useGrid)}
          ></ToggleBtn>
        </Toolbar>
      </Box>
      <Box style={plotstyle} flex={1} display="flex">
        <VisCanvas
          abscissaConfig={{
            showGrid: useGrid,
            visDomain: domainx ? domainx : [0, 1],
          }}
          ordinateConfig={{
            showGrid: useGrid,
            visDomain: domain ? domain : [0, 1],
          }}
        >
          <DefaultInteractions />
          <TooltipMesh renderTooltip={tooltipText} />
          <ResetZoomButton />

          {ydata && xdata && (
            <DataCurve
              abscissas={xdata.data}
              color="green"
              ordinates={ydata.data}
              visible={true}
            />
          )}
        </VisCanvas>
      </Box>
    </Paper>
  );
}
