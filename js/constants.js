// ── Debug / Version ───────────────────────────────────────────────────────────
var versionCode = "ver. 04/27/2026 @ 10:51 PM"
var initialEncounterOverride = 0; // set to 7 to skip tutorial (must equal Depths of Slumber row count + 2)

function isLocalhost() {
  return location.hostname === "localhost"
      || location.hostname === "127.0.0.1"
      || location.hostname.includes("192.168");
}
if (isLocalhost()) initialEncounterOverride = 5;

// ── Colors ────────────────────────────────────────────────────────────────────
var colorWhite         = "#FFFFFF";
var colorGold          = "#FFD940";
var colorDarkGold      = "#4d4112";
var colorGreen         = "#22BF22";
var colorSoftGreen     = "#62a862ff";
var colorDarkGreen     = "#509920";
var colorLime          = "#91bf08";
var colorGrapefruit    = "#db432c";
var colorRed           = "#FF0000";
var colorSoftRed       = "#ef4646ff";
var colorDarkRed       = "#690000";
var colorGrey          = "#CCCCCC";
var colorDarkGrey      = "#888888";
var colorSemiDarkGrey  = "#999999";
var colorOrange        = "orange";
var colorDarkOrange    = "#523501";
var colorYellow        = "#F7D147";
var colorDarkYellow    = "#d6b53c";
var colorBlue          = "#1059AA";
var colorLightBlue     = "#487bb5";
var colorDarkBlue      = "#072a52";
var colorPurple        = "#BF40BF";
var colorDarkPurple    = "#381338";
var colorPink          = "#c9594f";
var colorLightPink     = "#e38aac";
var colorDarkPink      = "#a1111a";
var colorShadeBlue     = "#556f90";
var colorLightShadeBlue = "#7193bf";
var colorCardBackground = "#202020";
var colorPaper         = "#d1bd91";
var colorDarkPaper     = "#8c7f61";

// ── UI Symbols ────────────────────────────────────────────────────────────────
var fullSymbol  = "<p style=\"color:"+colorGrey+";font-size:18px;display:inline;\">●</p>";
var emptySymbol = "<p style=\"color:"+colorGrey+";font-size:18px;display:inline;\">○</p>";
var enemyStatusString = "";
var newline    = "<br>";
var emptySpace = "&nbsp";
var narrowSpace = "&#8239;";
var arrowSymbol = "▸";
