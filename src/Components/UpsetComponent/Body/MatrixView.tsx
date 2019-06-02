import * as React from "react";
import { RenderRow } from "../../../types/Data.type";
import { RowType } from "../../../types/RowType.enum";
import { Subset } from "../../../types/Subset";
import * as d3 from "d3";
import styles from "./body.module.scss";

interface Props {
  rows: RenderRow[];
  rowHeight: number;
  matrixWidth: number;
  circRadius: number;
  visibleSetCount: number;
}

const MatrixView: React.FC<Props> = ({
  rows,
  rowHeight,
  matrixWidth,
  circRadius,
  visibleSetCount
}) => {
  const arr = Array.from(Array(visibleSetCount).keys());
  return (
    <g>
      <g className="set-background-columns">
        {arr.map(i => {
          return (
            <g
              key={i}
              className={styles.set_background_column}
              onMouseEnter={() => {
                d3.selectAll(`.Set_${i}`).classed(styles.set_highlight, true);
              }}
              onMouseLeave={() => {
                d3.selectAll(`.Set_${i}`).classed(styles.set_highlight, false);
              }}
            >
              <rect
                className={`Set_${i}`}
                width={20}
                height={rowHeight * rows.length}
                fill="none"
                transform={`translate(${20 * i}, 0)`}
              />
            </g>
          );
        })}
      </g>

      {rows.map((row: RenderRow, idx: number) => {
        return (
          <g
            className={styles.combinations}
            transform={`translate(0, ${rowHeight * idx})`}
            key={row.id}
          >
            <rect height={rowHeight} width={matrixWidth} fill="none" />
            {row.type === RowType.SUBSET ? (
              <g className="combinations" transform={`translate(${10},${10})`}>
                {(row as Subset).combinedSets.map(
                  (set: number, set_idx: number) => {
                    return (
                      <circle
                        key={set_idx}
                        className={
                          set === 1
                            ? styles.is_set_member
                            : styles.is_not_set_member
                        }
                        r={circRadius * 0.9}
                        transform={`translate(${set_idx * circRadius * 2}, 0)`}
                      />
                    );
                  }
                )}
              </g>
            ) : (
              <g />
            )}
          </g>
        );
      })}
    </g>
  );
};

export default MatrixView;
