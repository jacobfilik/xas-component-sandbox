import {
  Toolbar,
  ToggleBtn,
  VisCanvas,
  DefaultInteractions,
  TooltipMesh,
  ResetZoomButton,
  type Domain,
  HeatmapMesh,
  DomainWidget,
  COLOR_SCALE_TYPES,
  ColorBar,
  getVisDomain,
  type CustomDomain,
  ColorMapSelector,
  ScaleSelector,
} from "@h5web/lib";
import "@h5web/lib/styles.css";

import type { ColorMap } from "@h5web/lib";

import Paper from "@mui/material/Paper";
import { MdAspectRatio, MdGridOn } from "react-icons/md";

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
  const [customDomain, setCustomDomain] = useState<CustomDomain>([null, null]);
  const visDomain = getVisDomain(customDomain, props.crange);
  const [invertColorMap, setInvertColorMap] = useState(false);
  const [colorMap, setColorMap] = useState<ColorMap>("Viridis");
  const [colorScaleType, setColorScaleType] = useState(COLOR_SCALE_TYPES[0]);
  const [keepRatio, setKeepRatio] = useState(false);
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
          <DomainWidget
            customDomain={customDomain}
            dataDomain={props.crange}
            onCustomDomainChange={(d) => {
              console.log(d);
              setCustomDomain(d);
            }}
            scaleType={colorScaleType}
          />
          <ColorMapSelector
            value={colorMap}
            invert={false}
            onInversionChange={() => setInvertColorMap(!invertColorMap)}
            onValueChange={(cm) => setColorMap(cm)}
          ></ColorMapSelector>
          <ScaleSelector
            value={colorScaleType}
            onScaleChange={setColorScaleType}
            options={COLOR_SCALE_TYPES}
          />
          <ToggleBtn
            label="Keep ratio"
            value={keepRatio}
            Icon={MdAspectRatio}
            onToggle={() => setKeepRatio(!keepRatio)}
          ></ToggleBtn>
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
            label: "Position / μm",
          }}
          ordinateConfig={{
            showGrid: useGrid,
            visDomain: props.yrange,
            flip: true,
            label: "Spectrum index",
          }}
          aspect={keepRatio ? "equal" : "auto"}
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
              domain={visDomain}
              scaleType={colorScaleType}
              colorMap={colorMap}
              invertColorMap={invertColorMap}
              scale={[1, -1, 1]}
            />
          )}
        </VisCanvas>
        <ColorBar
          colorMap={colorMap}
          domain={props.crange}
          scaleType={colorScaleType}
          invertColorMap={invertColorMap}
        ></ColorBar>
      </Box>
    </Paper>
  );
}
