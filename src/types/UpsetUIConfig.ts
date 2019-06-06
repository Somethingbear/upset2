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
    attributeHeaders: {
      yOffset: number;
    };
  };
  headerBodyPadding: number;
  verticalPadding: number;
  body: {
    rowHeight: number;
    matrix: {
      circRadius: number;
    };
  };
}
