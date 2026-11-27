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

export function DataChartResult(props: {
  xdata: number[] | null;
  ydata: number[] | null;
  std: number[] | null;
}) {
  // const curveOptions: CurveType[] = Object.values(
  //   CurveType
  // ) as Array<CurveType>;

  const [useGrid, setUseGrid] = useState(true);
  const [scaleType, setScaleType] = useState(AXIS_SCALE_TYPES[0]);
  const [abscissaScaleType, setAbscissaScaleType] = useState(
    AXIS_SCALE_TYPES[0],
  );
  // const [curveOption, setCurveOption] = useState(curveOptions[0]);

  const ydata = props.ydata;
  const std = props.std;

  const lower =
    ydata && std
      ? ydata.map((val, idx) => {
          return val - std[idx];
        })
      : null;

  const upper =
    ydata && std
      ? ydata.map((val, idx) => {
          return val + std[idx];
        })
      : null;

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

  const tooltipText = (x: number, y: number): ReactElement<string> => {
    return (
      <p>
        {x.toPrecision(8)}, {y.toPrecision(8)}
      </p>
    );
  };

  const domain_l: Domain | undefined = lower ? getDomain(lower) : [0, 1];

  const domain_u: Domain | undefined = upper ? getDomain(upper) : [0, 1];

  const domain: Domain = [
    domain_l ? domain_l[0] : 0,
    domain_u ? domain_u[1] : 1,
  ];
  const domainx: Domain | undefined = props.xdata
    ? getDomain(props.xdata)
    : [0, 1];

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
            label: "Position / mm",
          }}
          ordinateConfig={{
            showGrid: useGrid,
            visDomain: domain ? domain : [0, 1],
            scaleType: scaleType,
            label: "Intensity",
          }}
        >
          <DefaultInteractions />
          <TooltipMesh renderTooltip={tooltipText} />
          <ResetZoomButton />

          {props.xdata && props.ydata && upper && lower && (
            <>
              <DataCurve
                abscissas={props.xdata}
                color={"red"}
                ordinates={lower}
                visible={true}
              />
              <DataCurve
                abscissas={props.xdata}
                color={"red"}
                ordinates={upper}
                visible={true}
              />
              <DataCurve
                abscissas={props.xdata}
                color={"blue"}
                ordinates={props.ydata}
                visible={true}
              />
            </>
          )}
        </VisCanvas>
      </Box>
    </Paper>
  );
}
