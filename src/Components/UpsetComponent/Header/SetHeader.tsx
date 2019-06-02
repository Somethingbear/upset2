import * as React from "react";
import SetHeaderBars from "./SetHeaderBars";
import { Set } from "../../../types/Set";
import SetHeaderLabels from "./SetHeaderLabels";

interface Props {
  usedSets: Set[];
  unusedSets: Set[];
  maxSetSize: number;

  setHeaderWidth: number;
  setHeaderHeight: number;

  setLabelWidth: number;
  setLabelHeight: number;
  setLabelSkewDegree: number;
}

const SetHeader: React.FC<Props> = ({
  usedSets,
  unusedSets,
  maxSetSize,
  setHeaderHeight,
  setHeaderWidth,
  setLabelWidth,
  setLabelHeight,
  setLabelSkewDegree
}) => {
  return (
    <g>
      <SetHeaderBars
        setHeaderHeight={setHeaderHeight}
        setHeaderWidth={setHeaderWidth}
        usedSets={usedSets}
        unusedSets={unusedSets}
        maxSetSize={maxSetSize}
      />
      <SetHeaderLabels
        setLabelHeight={setLabelHeight}
        setLabelWidth={setLabelWidth}
        usedSets={usedSets}
        setLabelSkewDegree={setLabelSkewDegree}
      />
    </g>
  );
};

export default SetHeader;
