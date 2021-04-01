import * as AS from '../../components/AppStateManager';

jest.mock('js-cookie');

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

    describe('combat', () => {
        it('handles guardian x change', () => {
            asm.combatEventHandlers.handleGuardianXChange(true);
            expect(state?.inputs.combat.guardian.active).toEqual(true);
            asm.combatEventHandlers.handleGuardianXChange(false);
            expect(state?.inputs.combat.guardian.active).toEqual(false);
        });

        it('handles guardian x value change', () => {
            asm.combatEventHandlers.handleGuardianXValueChange(2);
            expect(state?.inputs.combat.guardian.value).toEqual(2);
        });

        it('handles melee attack change', () => {
            asm.combatEventHandlers.handleMeleeAttackChange(true);
            expect(state?.inputs.combat.meleeAttack).toEqual(true);
            asm.combatEventHandlers.handleMeleeAttackChange(false);
            expect(state?.inputs.combat.meleeAttack).toEqual(false);
        });
    });
});
