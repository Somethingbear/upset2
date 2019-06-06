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
      height: number;
    };
    headerElementPadding: number;
  };
  headerBodyPadding: number;
  verticalPadding: number;
  attributeWidth: number;

  body: {
    rowHeight: number;
    matrix: {
      circRadius: number;
    };
  };
}
