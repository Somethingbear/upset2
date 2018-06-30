let params = {
  header_body_padding: 5,

  column_width: 20,

  used_set_header_height: 75,
  used_set_connector_height: 100,
  used_set_connector_skew: 45,
  get used_set_group_height() {
    return params.used_set_header_height + params.used_set_connector_height;
  },
  get skew_offset() {
    return (
      params.used_set_connector_height /
      Math.tan(deg2rad(params.used_set_connector_skew))
    );
  },

  row_height: 20,
  row_group_height: 20,

  used_set_width: 0,
  get group_row_width() {
    return params.skew_offset + params.used_set_width + params.column_width;
  },

  get svg_height() {
    return (
      params.used_set_group_height +
      params.row_group_height +
      params.header_body_padding +
      5
    );
  },
  get svg_width() {
    return `${100}%`;
  }
};

export default params;

export function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}
