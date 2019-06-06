import * as React from "react";
import { RenderRow } from "../../../types/Data.type";
import * as d3 from "d3";
import GComponent from "../../../Util/GComponent";

interface Props {
  rows: RenderRow[];
  rowHeight: number;
  cardinalityMax: number;
  width: number;
}

const CardinalityBars: React.FC<Props> = ({
  rows,
  rowHeight,
  width,
  cardinalityMax
}) => {
  const scale = d3
    .scaleLinear()
    .domain([0, cardinalityMax])
    .range([0, width]);

  const offset = 0.3;

  const colorArr = ["#bdbdbd", "#888888", "#252525"];

  return (
    <g>
      {rows.map((row: RenderRow, idx: number) => {
        let numberOfBands = Math.floor(scale(row.setSize) / width);
        let remainder = scale(row.setSize) % width;
        let breakBands = false;

        if (numberOfBands >= 3) {
          numberOfBands = 3;
          remainder = 0;
          breakBands = true;
        }
        const arr = Array.from(Array(numberOfBands).keys());

        return (
          <GComponent
            key={row.id}
            id={row.id}
            transform={`translate(0, ${rowHeight * idx})`}
            duration={300}
          >
            <g>
              {breakBands
                ? arr.map(i => {
                    const rectHeight = rowHeight * (1 - offset * (1 + i));
                    return (
                      <g key={i}>
                        <rect
                          transform={`translate(0, ${(rowHeight - rectHeight) /
                            2})`}
                          fill={colorArr[i]}
                          height={rectHeight}
                          width={width}
                        />
                        <line
                          y1={0}
                          y2={rowHeight}
                          x1={width * 0.9}
                          x2={width * 0.9 + 10}
                          stroke="white"
                          strokeWidth="2"
                        />
                        <line
                          y1={0}
                          y2={rowHeight}
                          x1={width * 0.9 + 5}
                          x2={width * 0.9 + 15}
                          stroke="white"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })
                : arr.map(i => {
                    const rectHeight = rowHeight * (1 - offset * (1 + i));
                    return (
                      <g key={i}>
                        <rect
                          transform={`translate(0, ${(rowHeight - rectHeight) /
                            2})`}
                          fill={colorArr[i]}
                          height={rectHeight}
                          width={width}
                        />
                      </g>
                    );
                  })}
              {remainder !== 0 ? (
                <rect
                  transform={`translate(0, ${(rowHeight -
                    rowHeight * (1 - offset * (1 + arr.length))) /
                    2})`}
                  fill={colorArr[arr.length]}
                  height={rowHeight * (1 - offset * (1 + arr.length))}
                  width={remainder}
                />
              ) : (
                <g />
              )}
              <text
                dominantBaseline="middle"
                transform={`translate(${
                  arr.length > 0 ? width * 1.05 : scale(row.setSize) * 1.05
                }, ${rowHeight / 2})`}
              >
                {row.setSize}
              </text>
            </g>
          </GComponent>
        );
      })}
    </g>
  );
};

export default CardinalityBars;
