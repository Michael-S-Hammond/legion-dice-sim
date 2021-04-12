import { ApplicationInsights } from '@microsoft/applicationinsights-web'

export class Telemetry {
  private _appInsights: ApplicationInsights;

  constructor() {
    this._appInsights = new ApplicationInsights({
      config: {
        connectionString: 'InstrumentationKey=693daa77-5cc8-4b66-be41-0cc5d3e8c460;IngestionEndpoint=https://northcentralus-0.in.applicationinsights.azure.com/'
      }
    });
    this._appInsights.loadAppInsights();
    this._appInsights.trackPageView();
  }

  // TODO: Fix this once negated types are in Typescript. (i.e. no functions, etc.) https://github.com/Microsoft/TypeScript/pull/29317
  public trackEvent(eventName: string, data: any) : void {  // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    if (data) {
      this._appInsights.trackEvent({ name: eventName }, data);
    }
  }
}
