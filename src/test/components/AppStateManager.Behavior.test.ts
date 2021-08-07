import * as AS from '../../components/AppStateManager';

describe('AppStateManager', () => {
    let state: AS.AppState | undefined = undefined;
    const setState = (newState: AS.AppState) => {
        state = newState;
    };
    let asm = new AS.AppStateManager(setState);

    beforeEach(() => {
        state = undefined;
        asm = new AS.AppStateManager(setState);
    });

    describe('behavior', () => {
        it('handles dice count change', () => {
            asm.behaviorEventHandlers.handleDiceCountChange(1);
            expect(state?.diceRolls).toEqual(1);
            asm.behaviorEventHandlers.handleDiceCountChange(10000);
            expect(state?.diceRolls).toEqual(10000);
        });
    });
});
