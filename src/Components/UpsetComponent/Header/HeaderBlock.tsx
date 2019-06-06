import * as React from "react";
import styles from "./header.module.scss";

interface Props {
  text: string;
  width: number;
  height: number;
  fontSize: number;
  onClick: any;
}

const HeaderBlock: React.FC<Props> = ({
  text,
  width,
  height,
  fontSize,
  onClick
}) => {
  return (
    <g>
      <rect
        className={`${styles.header_block} ${styles.sort_cursor}`}
        height={height}
        width={width}
        onClick={() => {
          onClick();
        }}
      />
      <text
        className={`${styles.sort_cursor} ${styles.stop_pointer_events}`}
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={`${fontSize}em`}
      >
        {text}
      </text>
    </g>
  );
};

export default HeaderBlock;
