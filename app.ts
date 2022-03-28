const doGet = () => {
  const template = HtmlService.createTemplateFromFile('maps');
  template.maps_api_key = GOOGLE_MAPS_API_KEY;
  return template
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
};

const getEvents = ({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string;
}) => {
  if (!CALENDAR_ID) return returnError('calendar id not found.');
  //   if (!GOOGLE_MAPS_API_KEY) return 'google maps api key not found.';
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!calendar) return returnError('calendar not found.');

  const start = new Date(start_date);
  const end = new Date(end_date);

  const events = calendar.getEvents(start, end);

  const events_data = events
    .map((event) => {
      const location = event.getLocation();
      if (!location) return null;
      const geo = geoCode(location);
      if (!geo) return null;
      const event_data = getEventData(event);
      return { ...event_data, location, geo };
    })
    .filter((d) => d);
  return JSON.stringify(events_data);
};

const getEventData = (event: GoogleAppsScript.Calendar.CalendarEvent) => ({
  title: event.getTitle(),
  description: event.getDescription(),
  start_time: event.getStartTime(),
  end_time: event.getEndTime(),
});

const returnError = (message: string) =>
  JSON.stringify({
    error: true,
    message,
  });
