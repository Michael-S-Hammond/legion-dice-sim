import { ApplicationInsights } from '@microsoft/applicationinsights-web'

export class Telemetry {
  private static _initialized = false;
  private static _appInsights: ApplicationInsights;

  private static initialize() {
    Telemetry._appInsights = new ApplicationInsights({
      config: {
        connectionString: 'InstrumentationKey=693daa77-5cc8-4b66-be41-0cc5d3e8c460;IngestionEndpoint=https://northcentralus-0.in.applicationinsights.azure.com/'
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
