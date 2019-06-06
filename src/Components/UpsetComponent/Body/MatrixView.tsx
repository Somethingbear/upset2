import * as React from "react";
import { RenderRow } from "../../../types/Data.type";
import { RowType } from "../../../types/RowType.enum";
import { Subset } from "../../../types/Subset";
import * as d3 from "d3";
import styles from "./body.module.scss";
import { Transition, TransitionGroup } from "react-transition-group";
import GComponent from "../../../Util/GComponent";

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
  circRadius,
  visibleSetCount
}) => {
  const arr = Array.from(Array(visibleSetCount).keys());
  return (
    <g>
      <g className="set-background-columns">
        {arr.map(i => {
          return (
            <g key={i}>
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
      <TransitionGroup component="g">
        {rows.map((row: RenderRow, idx: number) => {
          return (
            <GComponent
              key={row.id}
              transform={`translate(0, ${rowHeight * idx})`}
              id={row.id}
              duration={300}
            >
              {row.type === RowType.SUBSET ? (
                <g
                  className={styles.combinations}
                  transform={`translate(${10},${10})`}
                  onMouseEnter={() => {
                    const arr = (row as Subset).combinedSets
                      .map((d, i) => (d === 1 ? i : -1))
                      .filter(i => i !== -1);

                    arr.forEach(i => {
                      d3.selectAll(`.Set_${i}`).classed(
                        styles.set_highlight,
                        true
                      );
                    });
                  }}
                  onMouseLeave={() => {
                    const arr = (row as Subset).combinedSets
                      .map((d, i) => (d === 1 ? i : -1))
                      .filter(i => i !== -1);

                    arr.forEach(i => {
                      d3.selectAll(`.Set_${i}`).classed(
                        styles.set_highlight,
                        false
                      );
                    });
                  }}
                >
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
                          transform={`translate(${set_idx *
                            circRadius *
                            2}, 0)`}
                          onMouseEnter={() => {
                            d3.selectAll(`.Set_${set_idx}`).classed(
                              styles.set_highlight2,
                              true
                            );
                          }}
                          onMouseLeave={() => {
                            d3.selectAll(`.Set_${set_idx}`).classed(
                              styles.set_highlight2,
                              false
                            );
                          }}
                        />
                      );
                    }
                  )}
                </g>
              ) : (
                // Render Groups here
                <g />
              )}
            </GComponent>
          );
        })}
      </TransitionGroup>
    </g>
  );
};

export default MatrixView;
