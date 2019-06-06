import * as React from "react";
import { Set } from "../../../types/Set";
import * as d3 from "d3";
import styles from "./header.module.scss";

interface Props {
  usedSets: Set[];

  setLabelWidth: number;
  setLabelHeight: number;

  setLabelSkewDegree: number;
}

const SetHeaderLabels: React.FC<Props> = ({
  usedSets,
  setLabelHeight,
  setLabelWidth,
  setLabelSkewDegree
}) => {
  const skew = (Math.PI / 180) * setLabelSkewDegree;
  const labelTextOffset = setLabelHeight / Math.tan(skew);
  return (
    <g>
      <g transform={`translate(0,${setLabelHeight})`}>
        {usedSets.map((set: Set, idx: number) => {
          return (
            <g
              key={set.id}
              transform={`translate(${setLabelWidth * idx}, 0)`}
              onMouseEnter={() => {
                d3.selectAll(`.${set.id}`).classed(styles.set_highlight, true);
              }}
              onMouseLeave={() => {
                d3.selectAll(`.${set.id}`).classed(styles.set_highlight, false);
              }}
            >
              <rect
                className={`${styles.set_header_background} ${set.id}`}
                width={setLabelWidth}
                height={setLabelHeight}
                transform={`skewX(${setLabelSkewDegree})`}
              />
              <text
                textAnchor="end"
                // dominantBaseline="central"
                transform={`translate(${labelTextOffset}, ${setLabelHeight})rotate(${setLabelSkewDegree})`}
              >
                {set.elementName}
              </text>
            </g>
          );
        })}
      </g>
    </g>
  );
};

export default SetHeaderLabels;
