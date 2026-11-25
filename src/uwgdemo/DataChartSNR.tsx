import {
  Toolbar,
  ToggleBtn,
  VisCanvas,
  DefaultInteractions,
  TooltipMesh,
  ResetZoomButton,
  DataCurve,
  type Domain,
  AXIS_SCALE_TYPES,
  ScaleSelector,
  getDomain,
} from "@h5web/lib";
import "@h5web/lib/styles.css";

import Paper from "@mui/material/Paper";
import { MdGridOn } from "react-icons/md";

import { useTheme, type Theme } from "@mui/material";
import { type ReactElement, useState } from "react";

import { Box } from "@mui/material";

// function CurveOption(props: { option: CurveType }) {
//   const { option } = props;

//   return (
//     <div>
//       <span>{String(option)}</span>
//     </div>
//   );
// }

export function DataChartSNR(props: { ydata: number[] | null }) {
  // const curveOptions: CurveType[] = Object.values(
  //   CurveType
  // ) as Array<CurveType>;

  const [useGrid, setUseGrid] = useState(true);
  const [scaleType, setScaleType] = useState(AXIS_SCALE_TYPES[0]);
  const [abscissaScaleType, setAbscissaScaleType] = useState(
    AXIS_SCALE_TYPES[0],
  );
  // const [curveOption, setCurveOption] = useState(curveOptions[0]);

  const theme: Theme = useTheme();

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

  const xdata = props.ydata
    ? Array.from({ length: props.ydata.length }, (_value, index) => index)
    : null;

  const tooltipText = (x: number, y: number): ReactElement<string> => {
    return (
      <p>
        {x.toPrecision(8)}, {y.toPrecision(8)}
      </p>
    );
  };

  const domain: Domain | undefined = props.ydata
    ? getDomain(props.ydata)
    : [0, 1];
  const domainx: Domain | undefined = xdata ? getDomain(xdata) : [0, 1];

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        minHeight: "10px",
        flexDirection: "column",
        backgroundColor: (theme: Theme) => theme.palette.background.default,
        fontFamily: (theme: Theme) => theme.typography.fontFamily,
      }}
    >
      <Box style={toolbarstyle}>
        <Toolbar>
          <ScaleSelector
            label="X"
            value={abscissaScaleType}
            onScaleChange={setAbscissaScaleType}
            options={AXIS_SCALE_TYPES}
          />
          <ScaleSelector
            label="Y"
            value={scaleType}
            onScaleChange={setScaleType}
            options={AXIS_SCALE_TYPES}
          />

          <ToggleBtn
            label="Grid"
            value={useGrid}
            Icon={MdGridOn}
            onToggle={() => setUseGrid(!useGrid)}
          ></ToggleBtn>
        </Toolbar>
      </Box>
      <Box style={plotstyle} flex={1} display="flex" minHeight="10px">
        <VisCanvas
          abscissaConfig={{
            showGrid: useGrid,
            visDomain: domainx ? domainx : [0, 1],
            scaleType: abscissaScaleType,
          }}
          ordinateConfig={{
            showGrid: useGrid,
            visDomain: domain ? domain : [0, 1],
            scaleType: scaleType,
          }}
        >
          <DefaultInteractions />
          <TooltipMesh renderTooltip={tooltipText} />
          <ResetZoomButton />

          {xdata && props.ydata && (
            <DataCurve
              abscissas={xdata}
              color={"blue"}
              ordinates={props.ydata}
              visible={true}
            />
          )}
        </VisCanvas>
      </Box>
    </Paper>
  );
}
