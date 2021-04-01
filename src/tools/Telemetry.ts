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

  public trackEvent(eventName: string, data: any) {
    if (data) {
      this._appInsights.trackEvent({ name: eventName }, data);
    }
  }
}
