const geoCode = (address: string) => {
  const { results } = Maps.newGeocoder().geocode(address);
  if (!results || !results[0]) return null;
  const { lat, lng } = results[0].geometry.location;
  return { lat, lng };
};
