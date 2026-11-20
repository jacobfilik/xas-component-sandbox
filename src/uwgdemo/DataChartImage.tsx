import {
  Toolbar,
  ToggleBtn,
  VisCanvas,
  DefaultInteractions,
  TooltipMesh,
  ResetZoomButton,
  type Domain,
  HeatmapMesh,
  ScaleType,
} from "@h5web/lib";
import "@h5web/lib/styles.css";

import Paper from "@mui/material/Paper";
import { MdGridOn } from "react-icons/md";

import { useTheme, type Theme } from "@mui/material";
import { useState } from "react";

import { type NdArray } from "ndarray";
import { Box } from "@mui/material";

export function DataChartImage(props: {
  data: NdArray<Float32Array> | null;
  xrange: Domain;
  yrange: Domain;
  crange: Domain;
}) {
  // const curveOptions: CurveType[] = Object.values(
  //   CurveType
  // ) as Array<CurveType>;

  const [useGrid, setUseGrid] = useState(true);
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

  return (
    <Paper
      sx={{
        height: "100%",
        minHeight: "10px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme: Theme) => theme.palette.background.default,
        fontFamily: (theme: Theme) => theme.typography.fontFamily,
      }}
    >
      <Box style={toolbarstyle}>
        <Toolbar>
          {/* <DomainWidget
  customDomain={[
    null,
    null
  ]}
  dataDomain={c_domain}
  onCustomDomainChange={function lX(){}}
  scaleType={COLOR_SCALE_TYPES[0]}
/> */}
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
            showGrid: false,
            visDomain: props.xrange,
          }}
          ordinateConfig={{
            showGrid: false,
            visDomain: props.yrange,
            flip: true,
          }}
        >
          <ResetZoomButton />
          <DefaultInteractions />
          {props.data && (
            <TooltipMesh
              renderTooltip={(x, y) => {
                const col = Math.floor(x);
                const row = Math.floor(y);
                return (
                  <div>{`[${row}, ${col}]: ${props.data ? props.data.get(row, col) : ""}`}</div>
                );
              }}
            />
          )}

          {props.data && (
            <HeatmapMesh
              values={props.data}
              domain={props.crange}
              scaleType={ScaleType.Linear}
              colorMap="Viridis"
              invertColorMap={false}
              scale={[1, -1, 1]}
            />
          )}
        </VisCanvas>
      </Box>
    </Paper>
  );
}
