import * as React from "react";
import { Set } from "../../../types/Set";
import * as d3 from "d3";
import styles from "./header.module.scss";

interface Props {
  usedSets: Set[];
  unusedSets: Set[];
  maxSetSize: number;

  setHeaderWidth: number;
  setHeaderHeight: number;
}

const SetHeaderBars: React.FC<Props> = ({
  usedSets,
  unusedSets,
  maxSetSize,
  setHeaderWidth,
  setHeaderHeight
}) => {
  return (
    <g>
      <g transform={`translate(0,0)`}>
        {usedSets.map((set: Set, idx: number) => {
          return (
            <g
              key={set.id}
              transform={`translate(${setHeaderWidth * idx}, 0)`}
              onMouseEnter={() => {
                d3.selectAll(`.${set.id}`).classed(styles.set_highlight, true);
              }}
              onMouseLeave={() => {
                d3.selectAll(`.${set.id}`).classed(styles.set_highlight, false);
              }}
            >
              <rect
                className={`${styles.set_header_background} ${set.id}`}
                width={setHeaderWidth}
                height={setHeaderHeight}
              />
              <rect
                className={styles.set_header_foreground}
                transform={`translate(0, ${setHeaderHeight -
                  (set.setSize / maxSetSize) * setHeaderHeight})`}
                width={setHeaderWidth}
                stroke="white"
                strokeWidth={1}
                height={(set.setSize / maxSetSize) * setHeaderHeight}
              />
            </g>
          );
        })}
      </g>
    </g>
  );
};

export default SetHeaderBars;
