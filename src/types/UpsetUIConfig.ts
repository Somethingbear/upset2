export interface UpsetConfig {
  header: {
    bar: {
      height: number;
      width: number;
    };
    label: {
      height: number;
      width: number;
      skew: number;
    };
  };
  headerBodyPadding: number;
  body: {
    rowHeight: number;
    matrix: {
      circRadius: number;
    };
  };
}
