import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Telemetry } from '../../tools/Telemetry';

jest.mock('@microsoft/applicationinsights-web');

const ApplicationInsightsMock = ApplicationInsights as jest.MockedClass<typeof ApplicationInsights>;

describe('Telemetry', () => {
    beforeEach(() => {
        ApplicationInsightsMock.mockClear();
    });

    it('App Insights initialized', () => {
        const telemetry = new Telemetry();
        expect(ApplicationInsightsMock).toHaveBeenCalledTimes(1);
        expect(ApplicationInsightsMock.prototype.loadAppInsights).toHaveBeenCalledTimes(1);
        expect(ApplicationInsightsMock.prototype.trackPageView).toHaveBeenCalledTimes(1);
    });

    it('logs event data when provided', () => {
        const telemetry = new Telemetry();
        telemetry.trackEvent('unit test data', { a: 'a', b: 'b'});
        expect(ApplicationInsightsMock.prototype.trackEvent).toHaveBeenCalledTimes(1);
        expect(ApplicationInsightsMock.prototype.trackEvent).toHaveBeenCalledWith({ name: 'unit test data'}, { a: 'a', b: 'b' });
    });

    it('does not log event data when not provided', () => {
        const telemetry = new Telemetry();
        telemetry.trackEvent('unit test data', undefined);
        expect(ApplicationInsightsMock.prototype.trackEvent).toHaveBeenCalledTimes(0);
    });
});
