export function buildGoogleDirectionsUrl(query: string): string {
  const params = new URLSearchParams({ api: "1", destination: query });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
