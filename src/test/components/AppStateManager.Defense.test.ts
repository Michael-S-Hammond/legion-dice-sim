import * as T from '../../code/Types';
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

    describe('defense', () => {
        it('handles die change', () => {
            expect(asm.state.inputs.defense.dieColor).toEqual(T.DieColor.White);
            expect(asm.state.inputs.defense.surge).toEqual(true);
            asm.defenseEventHandlers.changeDie();
            expect(state?.inputs.defense.dieColor).toEqual(T.DieColor.Red);
            expect(state?.inputs.defense.surge).toEqual(false);
            asm.defenseEventHandlers.changeDie();
            expect(state?.inputs.defense.dieColor).toEqual(T.DieColor.Red);
            expect(state?.inputs.defense.surge).toEqual(true);
            asm.defenseEventHandlers.changeDie();
            expect(state?.inputs.defense.dieColor).toEqual(T.DieColor.White);
            expect(state?.inputs.defense.surge).toEqual(false);
            asm.defenseEventHandlers.changeDie();
            expect(state?.inputs.defense.dieColor).toEqual(T.DieColor.White);
            expect(state?.inputs.defense.surge).toEqual(true);
        });

        it('increments dodge tokens', () => {
            asm.defenseEventHandlers.incrementDodgeTokenCount();
            asm.defenseEventHandlers.incrementDodgeTokenCount();

            expect(state?.inputs.defense.tokens.dodge).toEqual(2);
        });

        it('increments observation tokens', () => {
            asm.defenseEventHandlers.incrementObservationTokenCount();
            asm.defenseEventHandlers.incrementObservationTokenCount();
            asm.defenseEventHandlers.incrementObservationTokenCount();

            expect(state?.inputs.defense.tokens.observation).toEqual(3);
        });

        it('increments shield tokens', () => {
            asm.defenseEventHandlers.incrementShieldTokenCount();
            asm.defenseEventHandlers.incrementShieldTokenCount();
            asm.defenseEventHandlers.incrementShieldTokenCount();
            asm.defenseEventHandlers.incrementShieldTokenCount();

            expect(state?.inputs.defense.tokens.shield).toEqual(4);
        });

        it('increments suppression tokens', () => {
            asm.defenseEventHandlers.incrementSuppressionTokenCount();
            asm.defenseEventHandlers.incrementSuppressionTokenCount();
            asm.defenseEventHandlers.incrementSuppressionTokenCount();
            asm.defenseEventHandlers.incrementSuppressionTokenCount();
            asm.defenseEventHandlers.incrementSuppressionTokenCount();
            asm.defenseEventHandlers.incrementSuppressionTokenCount();

            expect(state?.inputs.defense.tokens.suppression).toEqual(6);
        });

        it('increments surge tokens', () => {
            asm.defenseEventHandlers.incrementSurgeTokenCount();
            asm.defenseEventHandlers.incrementSurgeTokenCount();
            asm.defenseEventHandlers.incrementSurgeTokenCount();
            asm.defenseEventHandlers.incrementSurgeTokenCount();
            asm.defenseEventHandlers.incrementSurgeTokenCount();

            expect(state?.inputs.defense.tokens.surge).toEqual(5);
        });

        it('resets token count', () => {
            asm.defenseEventHandlers.incrementDodgeTokenCount();
            asm.defenseEventHandlers.incrementObservationTokenCount();
            asm.defenseEventHandlers.incrementShieldTokenCount();
            asm.defenseEventHandlers.incrementShieldTokenCount();
            asm.defenseEventHandlers.incrementSuppressionTokenCount();
            asm.defenseEventHandlers.incrementSuppressionTokenCount();
            asm.defenseEventHandlers.incrementSuppressionTokenCount();
            asm.defenseEventHandlers.incrementSuppressionTokenCount();
            asm.defenseEventHandlers.incrementSurgeTokenCount();
            asm.defenseEventHandlers.incrementSurgeTokenCount();
            asm.defenseEventHandlers.incrementSurgeTokenCount();

            asm.defenseEventHandlers.resetTokenCount();

            expect(state?.inputs.defense.tokens.dodge).toEqual(0);
            expect(state?.inputs.defense.tokens.observation).toEqual(0);
            expect(state?.inputs.defense.tokens.shield).toEqual(0);
            expect(state?.inputs.defense.tokens.surge).toEqual(0);
            expect(state?.inputs.defense.tokens.suppression).toEqual(0);
        });

        it('handles changing cover', () => {
            asm.defenseEventHandlers.handleCoverChange(T.Cover.Light);
            expect(state?.inputs.defense.cover).toEqual(T.Cover.Light);
            asm.defenseEventHandlers.handleCoverChange(T.Cover.Heavy);
            expect(state?.inputs.defense.cover).toEqual(T.Cover.Heavy);
            asm.defenseEventHandlers.handleCoverChange(T.Cover.None);
            expect(state?.inputs.defense.cover).toEqual(T.Cover.None);
        });

        it('handles armor change', () => {
            asm.defenseEventHandlers.handleArmorChange(true);
            expect(state?.inputs.defense.armor).toEqual(true);
            asm.defenseEventHandlers.handleArmorChange(false);
            expect(state?.inputs.defense.armor).toEqual(false);
        });

        it('handles armor x change', () => {
            asm.defenseEventHandlers.handleArmorXChange(true);
            expect(state?.inputs.defense.armorX.active).toEqual(true);
            asm.defenseEventHandlers.handleArmorXChange(false);
            expect(state?.inputs.defense.armorX.active).toEqual(false);
        });

        it('handles armor x value change', () => {
            asm.defenseEventHandlers.handleArmorXValueChange(2);
            expect(state?.inputs.defense.armorX.value).toEqual(2);
        });

        it('handles block change', () => {
            asm.defenseEventHandlers.handleBlockChange(true);
            expect(state?.inputs.defense.block).toEqual(true);
            asm.defenseEventHandlers.handleBlockChange(false);
            expect(state?.inputs.defense.block).toEqual(false);
        });

        it('handles danger sense x change', () => {
            asm.defenseEventHandlers.handleDangerSenseXChange(true);
            expect(state?.inputs.defense.dangerSenseX.active).toEqual(true);
            asm.defenseEventHandlers.handleDangerSenseXChange(false);
            expect(state?.inputs.defense.dangerSenseX.active).toEqual(false);
        });

        it('handles danger sense x value change', () => {
            asm.defenseEventHandlers.handleDangerSenseXValueChange(4);
            expect(state?.inputs.defense.dangerSenseX.value).toEqual(4);
        });

        it('handles deflect change', () => {
            asm.defenseEventHandlers.handleDeflectChange(true);
            expect(state?.inputs.defense.deflect).toEqual(true);
            asm.defenseEventHandlers.handleDeflectChange(false);
            expect(state?.inputs.defense.deflect).toEqual(false);
        });

        it('handles djem so mastery change', () => {
            asm.defenseEventHandlers.handleDjemSoMasteryChange(true);
            expect(state?.inputs.defense.djemSoMastery).toEqual(true);
            asm.defenseEventHandlers.handleDjemSoMasteryChange(false);
            expect(state?.inputs.defense.djemSoMastery).toEqual(false);
        });

        it('handles duelist change', () => {
            asm.defenseEventHandlers.handleDuelistChange(true);
            expect(state?.inputs.defense.duelist).toEqual(true);
            asm.defenseEventHandlers.handleDuelistChange(false);
            expect(state?.inputs.defense.duelist).toEqual(false);
        });

        it('handles has force upgrades change', () => {
            asm.defenseEventHandlers.handleHasForceUpgradesChange(true);
            expect(state?.inputs.defense.hasForceUpgrades).toEqual(true);
            asm.defenseEventHandlers.handleHasForceUpgradesChange(false);
            expect(state?.inputs.defense.hasForceUpgrades).toEqual(false);
        });

        it('handles immune: blast change', () => {
            asm.defenseEventHandlers.handleImmuneBlastChange(true);
            expect(state?.inputs.defense.immuneBlast).toEqual(true);
            asm.defenseEventHandlers.handleImmuneBlastChange(false);
            expect(state?.inputs.defense.immuneBlast).toEqual(false);
        });

        it('handles immune: pierce change', () => {
            asm.defenseEventHandlers.handleImmunePierceChange(true);
            expect(state?.inputs.defense.immunePierce).toEqual(true);
            asm.defenseEventHandlers.handleImmunePierceChange(false);
            expect(state?.inputs.defense.immunePierce).toEqual(false);
        });

        it('handles impervious change', () => {
            asm.defenseEventHandlers.handleImperviousChange(true);
            expect(state?.inputs.defense.impervious).toEqual(true);
            asm.defenseEventHandlers.handleImperviousChange(false);
            expect(state?.inputs.defense.impervious).toEqual(false);
        });

        it('handles low profile change', () => {
            asm.defenseEventHandlers.handleLowProfileChange(true);
            expect(state?.inputs.defense.lowProfile).toEqual(true);
            asm.defenseEventHandlers.handleLowProfileChange(false);
            expect(state?.inputs.defense.lowProfile).toEqual(false);
        });

        it('handles outmaneuver change', () => {
            asm.defenseEventHandlers.handleOutmaneuverChange(true);
            expect(state?.inputs.defense.outmaneuver).toEqual(true);
            asm.defenseEventHandlers.handleOutmaneuverChange(false);
            expect(state?.inputs.defense.outmaneuver).toEqual(false);
        });

        it('handles soresu mastery change', () => {
            asm.defenseEventHandlers.handleSoresuMasteryChange(true);
            expect(state?.inputs.defense.soresuMastery).toEqual(true);
            asm.defenseEventHandlers.handleSoresuMasteryChange(false);
            expect(state?.inputs.defense.soresuMastery).toEqual(false);
        });

        it('handles uncanny luck x change', () => {
            asm.defenseEventHandlers.handleUncannyLuckXChange(true);
            expect(state?.inputs.defense.uncannyLuckX.active).toEqual(true);
            asm.defenseEventHandlers.handleUncannyLuckXChange(false);
            expect(state?.inputs.defense.uncannyLuckX.active).toEqual(false);
        });

        it('handles uncanny luck x value change', () => {
            asm.defenseEventHandlers.handleUncannyLuckXValueChange(3);
            expect(state?.inputs.defense.uncannyLuckX.value).toEqual(3);
        });
    });
});
