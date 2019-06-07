import * as React from "react";
import { RenderRow } from "../../../types/Data.type";
import GComponent from "../../../Util/GComponent";
import * as d3 from "d3";
import styles from "./body.module.scss";

interface Props {
  rows: RenderRow[];
  rowHeight: number;
  width: number;
  deviationMax: number;
}

const DeviationBars: React.FC<Props> = ({
  rows,
  rowHeight,
  width,
  deviationMax
}) => {
  const scale = d3
    .scaleLinear()
    .domain([0, deviationMax])
    .range([0, width / 2]);

  const rectHeight = rowHeight * 0.8;

  return (
    <g transform={`translate(${width / 2}, 0)`}>
      <line
        x1={0}
        y1={0}
        x2={0}
        y2={rowHeight * rows.length}
        className={styles.deviation_line}
      />
      {rows.map((row: RenderRow, idx: number) => {
        return (
          <GComponent
            key={row.id}
            id={row.id}
            transform={`translate(0, ${rowHeight * idx})`}
            duration={300}
          >
            <g transform={`translate(0, ${(rowHeight - rectHeight) / 2})`}>
              <rect
                width={scale(Math.abs(row.disproportionality))}
                height={rectHeight}
                transform={
                  row.disproportionality < 0
                    ? `translate(${scale(row.disproportionality)}, 0)`
                    : ""
                }
                className={
                  row.disproportionality >= 0
                    ? styles.positive_disproportionality
                    : styles.negative_disproportionality
                }
              />
            </g>
          </GComponent>
        );
      })}
    </g>
  );
};

export default DeviationBars;
