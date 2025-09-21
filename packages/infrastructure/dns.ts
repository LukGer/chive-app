export const domain = {
  dev: "dev.chive.lukger.dev",
  prod: "chive.lukger.dev",
}[$app.stage]!;

export const zone = cloudflare.getZoneOutput({
  zoneId: "2506294a3328c1fa1464e2563295a705",
});
