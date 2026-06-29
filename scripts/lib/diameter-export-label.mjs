/** Shared diameter label styling for PNG exports (larger than on-site diagram text). */
export const LABEL_FONT_SIZE_REM = 3;
export const LABEL_MARGIN_TOP_PX = 20;

export function diameterLabelCss() {
  return `
    .label {
      margin: ${LABEL_MARGIN_TOP_PX}px 0 0;
      font-family: "League Spartan", ui-sans-serif, system-ui, sans-serif;
      font-weight: 600;
      font-size: ${LABEL_FONT_SIZE_REM}rem;
      line-height: 1;
      color: #171717;
      font-variant-numeric: tabular-nums;
    }`;
}
