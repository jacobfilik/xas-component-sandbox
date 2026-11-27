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
} from "@h5web/lib";
import "@h5web/lib/styles.css";

import Paper from "@mui/material/Paper";
import { MdGridOn } from "react-icons/md";

import {
  darken,
  lighten,
  useColorScheme,
  useTheme,
  type Theme,
} from "@mui/material";
import { type ReactElement, useState } from "react";

import { type NdArray } from "ndarray";
import { Box } from "@mui/material";

// function CurveOption(props: { option: CurveType }) {
//   const { option } = props;

//   return (
//     <div>
//       <span>{String(option)}</span>
//     </div>
//   );
// }

const MAX_PLOT = 5;

export function DataChartSlice(props: {
  data: NdArray<Float32Array> | null;
  xrange: Domain;
}) {
  // const curveOptions: CurveType[] = Object.values(
  //   CurveType
  // ) as Array<CurveType>;
  const { colorScheme } = useColorScheme();
  const [useGrid, setUseGrid] = useState(true);
  const [scaleType, setScaleType] = useState(AXIS_SCALE_TYPES[0]);
  const [abscissaScaleType, setAbscissaScaleType] = useState(
    AXIS_SCALE_TYPES[0],
  );
  // const [curveOption, setCurveOption] = useState(curveOptions[0]);

  const theme: Theme = useTheme();

  const data_slices: Float32Array<ArrayBuffer>[] = [];

  let ydata = Array.from({ length: 100 }, (_value, index) => index);
  const plotColors: string[] = [];

  const modFunction = colorScheme === "dark" ? darken : lighten;

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  plotColors.push(theme.palette.primary.main);
  for (let i = 0; i < MAX_PLOT - 1; i++) {
    plotColors.push(modFunction(theme.palette.primary.main, 0.6 + i / 10));
  }

  if (props.data != null) {
    const length = props.data.data.length;
    const row_size = props.data.shape[1];

    const nAvail = length / row_size;

    const nPlot = nAvail > MAX_PLOT ? MAX_PLOT : nAvail;

    ydata = Array.from({ length: row_size }, (_value, index) => index);

    for (let i = 0; i < nPlot; i++) {
      const startSlice = length - row_size * (i + 1);
      const stopSlice = length - row_size * i - 1;

      const spec = props.data.data.slice(startSlice, stopSlice);

      const specMin = spec.reduce((min, cur) => {
        if (isNaN(cur) || min > cur) {
          return cur;
        } else {
          return min;
        }
      }, Number.POSITIVE_INFINITY);

      const specMax = spec.reduce((max, cur) => {
        if (isNaN(cur) || max < cur) {
          return cur;
        } else {
          return max;
        }
      }, Number.NEGATIVE_INFINITY);

      if (max < specMax) {
        max = specMax;
      }

      if (min > specMin) {
        min = specMin;
      }

      data_slices.push(spec);
    }

    data_slices.reverse();
    plotColors.reverse();
  }

  const offset = 5 - data_slices.length;
  console.log(offset);

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

  //   let domain: Domain | undefined = ydata ? getDomain(ydata) : [0, 1];
  //   let domainx: Domain | undefined = xdata ? getDomain(xdata) : [0, 1];

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
            visDomain: props.xrange,
            scaleType: abscissaScaleType,
            label: "Position / μm",
          }}
          ordinateConfig={{
            showGrid: useGrid,
            visDomain: isFinite(max) && isFinite(min) ? [min, max] : [0, 1],
            scaleType: scaleType,
            label: "Intensity",
          }}
        >
          <DefaultInteractions />
          <TooltipMesh renderTooltip={tooltipText} />
          <ResetZoomButton />

          {data_slices.map((s, i) => {
            return (
              <DataCurve
                key={i}
                abscissas={ydata}
                color={plotColors[i + offset]}
                ordinates={s}
                visible={true}
              />
            );
          })}
        </VisCanvas>
      </Box>
    </Paper>
  );
}
