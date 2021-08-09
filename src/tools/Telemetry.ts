import { ApplicationInsights } from '@microsoft/applicationinsights-web'

export class Telemetry {
  private static _initialized = false;
  private static _appInsights: ApplicationInsights;

  private static initialize() {
    Telemetry._appInsights = new ApplicationInsights({
      config: {
        connectionString: 'InstrumentationKey=58eb2b37-2eb1-4a5e-91b6-2e983bb20f36;IngestionEndpoint=https://eastus2-3.in.applicationinsights.azure.com/'
      }
    });
    Telemetry._appInsights.loadAppInsights();
    Telemetry._appInsights.trackPageView();
  }

  // TODO: Fix this once negated types are in Typescript. (i.e. no functions, etc.) https://github.com/Microsoft/TypeScript/pull/29317
  public static trackEvent(eventName: string, data: any) : void {  // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    if (data) {
      if(!Telemetry._initialized) {
        Telemetry.initialize();
      }
      Telemetry._appInsights.trackEvent({ name: eventName }, data);
    }
  }

  public static logError(file: string, func: string, info: string) : void {
    Telemetry.trackEvent("Error", {
      File: file,
      Function: func,
      Error: info
  });
}
}
