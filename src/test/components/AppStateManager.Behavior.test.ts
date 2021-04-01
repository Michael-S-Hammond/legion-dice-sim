import Cookies from 'js-cookie';

import * as AS from '../../components/AppStateManager';

jest.mock('js-cookie');

type getCookieType = (name: string) => string | undefined;
const getCookieMock = Cookies.get as jest.MockedFunction<typeof Cookies.get>;
const setCookieMock = Cookies.set as jest.MockedFunction<typeof Cookies.set>;

describe('AppStateManager', () => {
    let state: AS.AppState | undefined = undefined;
    const setState = (newState: AS.AppState) => {
        state = newState;
    };
    let asm = new AS.AppStateManager(setState);

    beforeEach(() => {
        state = undefined;
        getCookieMock.mockClear();
        setCookieMock.mockClear();
        asm = new AS.AppStateManager(setState);
    });

    describe('behavior', () => {
        it('checks cookies in initialization', () => {
            expect(getCookieMock).toBeCalledTimes(2);
            expect(getCookieMock.mock.calls[0][0]).toEqual('showExpectedRange');
            expect(getCookieMock.mock.calls[1][0]).toEqual('showSimpleView');
        });

        it('uses cookie values in initialization', () => {
            state = undefined;
            getCookieMock.mockClear();
            (Cookies.get as getCookieType) = jest.fn(name => 'true');
            setCookieMock.mockClear();

            asm = new AS.AppStateManager(setState);

            expect(asm.state.showExpectedRange).toStrictEqual(true);
            expect(asm.state.showSimpleView).toStrictEqual(true);
        });

        it('handles dice count change', () => {
            asm.behaviorEventHandlers.handleDiceCountChange(1);
            expect(state?.diceRolls).toEqual(1);
            asm.behaviorEventHandlers.handleDiceCountChange(10000);
            expect(state?.diceRolls).toEqual(10000);
        });

        it('handles show expected range change', () => {
            asm.behaviorEventHandlers.handleShowExpectedRangeChanged(false);
            expect(setCookieMock.mock.calls[0][0]).toEqual('showExpectedRange');
            expect(setCookieMock.mock.calls[0][1]).toEqual('false');
            expect(state?.showExpectedRange).toEqual(false);

            setCookieMock.mockClear();
            asm.behaviorEventHandlers.handleShowExpectedRangeChanged(true);
            expect(setCookieMock.mock.calls[0][0]).toEqual('showExpectedRange');
            expect(setCookieMock.mock.calls[0][1]).toEqual('true');
            expect(state?.showExpectedRange).toEqual(true);
        });

        it('handles show simplified view change', () => {
            asm.behaviorEventHandlers.handleShowSimplifiedViewChange(true);
            expect(setCookieMock.mock.calls[0][0]).toEqual('showSimpleView');
            expect(setCookieMock.mock.calls[0][1]).toEqual('true');
            expect(state?.showSimpleView).toEqual(true);

            setCookieMock.mockClear();
            asm.behaviorEventHandlers.handleShowSimplifiedViewChange(false);
            expect(setCookieMock.mock.calls[0][0]).toEqual('showSimpleView');
            expect(setCookieMock.mock.calls[0][1]).toEqual('false');
            expect(state?.showSimpleView).toEqual(false);
        });
    });
});
