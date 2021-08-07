import * as T from '../../code/Types';
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

    describe('attack', () => {
        it('increments red dice', () => {
            asm.attackEventHandlers.incrementRedDice();
            asm.attackEventHandlers.incrementRedDice();
            asm.attackEventHandlers.incrementRedDice();

            expect(state?.inputs.offense.redDice).toEqual(3);
        });

        it('increments black dice', () => {
            asm.attackEventHandlers.incrementBlackDice();
            asm.attackEventHandlers.incrementBlackDice();
            asm.attackEventHandlers.incrementBlackDice();
            asm.attackEventHandlers.incrementBlackDice();

            expect(state?.inputs.offense.blackDice).toEqual(4);
        });

        it('increments white dice', () => {
            asm.attackEventHandlers.incrementWhiteDice();
            asm.attackEventHandlers.incrementWhiteDice();
            asm.attackEventHandlers.incrementWhiteDice();
            asm.attackEventHandlers.incrementWhiteDice();
            asm.attackEventHandlers.incrementWhiteDice();
            asm.attackEventHandlers.incrementWhiteDice();

            expect(state?.inputs.offense.whiteDice).toEqual(6);
        });

        it('reset dice count', () => {
            asm.attackEventHandlers.incrementRedDice();
            asm.attackEventHandlers.incrementBlackDice();
            asm.attackEventHandlers.incrementBlackDice();
            asm.attackEventHandlers.incrementWhiteDice();
            asm.attackEventHandlers.incrementWhiteDice();
            asm.attackEventHandlers.incrementWhiteDice();

            asm.attackEventHandlers.resetDiceCount();

            expect(state?.inputs.offense.redDice).toEqual(0);
            expect(state?.inputs.offense.blackDice).toEqual(0);
            expect(state?.inputs.offense.whiteDice).toEqual(0);
        });

        it('increments aim tokens', () => {
            asm.attackEventHandlers.incrementAimTokenCount();
            asm.attackEventHandlers.incrementAimTokenCount();

            expect(state?.inputs.offense.tokens.aim).toEqual(2);
        });

        it('increments surge tokens', () => {
            asm.attackEventHandlers.incrementSurgeTokenCount();
            asm.attackEventHandlers.incrementSurgeTokenCount();
            asm.attackEventHandlers.incrementSurgeTokenCount();
            asm.attackEventHandlers.incrementSurgeTokenCount();

            expect(state?.inputs.offense.tokens.surge).toEqual(4);
        });

        it('resets token count', () => {
            asm.attackEventHandlers.incrementAimTokenCount();
            asm.attackEventHandlers.incrementAimTokenCount();
            asm.attackEventHandlers.incrementAimTokenCount();
            asm.attackEventHandlers.incrementSurgeTokenCount();

            asm.attackEventHandlers.resetTokenCounts();

            expect(state?.inputs.offense.tokens.aim).toEqual(0);
            expect(state?.inputs.offense.tokens.surge).toEqual(0);
        });

        it('handles changing surge conversion', () => {
            asm.attackEventHandlers.handleSurgeConversionChange(T.AttackSurgeConversion.Critical);
            expect(state?.inputs.offense.surge).toEqual(T.AttackSurgeConversion.Critical);
            asm.attackEventHandlers.handleSurgeConversionChange(T.AttackSurgeConversion.Hit);
            expect(state?.inputs.offense.surge).toEqual(T.AttackSurgeConversion.Hit);
            asm.attackEventHandlers.handleSurgeConversionChange(T.AttackSurgeConversion.Blank);
            expect(state?.inputs.offense.surge).toEqual(T.AttackSurgeConversion.Blank);
        });

        it('handles blast change', () => {
            asm.attackEventHandlers.handleBlastChange(true);
            expect(state?.inputs.offense.blast).toEqual(true);
            asm.attackEventHandlers.handleBlastChange(false);
            expect(state?.inputs.offense.blast).toEqual(false);
        });

        it('handles critical x change', () => {
            asm.attackEventHandlers.handleCriticalXChange(true);
            expect(state?.inputs.offense.criticalX.active).toEqual(true);
            asm.attackEventHandlers.handleCriticalXChange(false);
            expect(state?.inputs.offense.criticalX.active).toEqual(false);
        });

        it('handles critical x value change', () => {
            asm.attackEventHandlers.handleCriticalXValueChange(3);
            expect(state?.inputs.offense.criticalX.value).toEqual(3);
        });

        it('handles duelist change', () => {
            asm.attackEventHandlers.handleDuelistChange(true);
            expect(state?.inputs.offense.duelist).toEqual(true);
            asm.attackEventHandlers.handleDuelistChange(false);
            expect(state?.inputs.offense.duelist).toEqual(false);
        });

        it('handles high velocity change', () => {
            asm.attackEventHandlers.handleHighVelocityChange(true);
            expect(state?.inputs.offense.highVelocity).toEqual(true);
            asm.attackEventHandlers.handleHighVelocityChange(false);
            expect(state?.inputs.offense.highVelocity).toEqual(false);
        });

        it('handles impact x change', () => {
            asm.attackEventHandlers.handleImpactXChange(true);
            expect(state?.inputs.offense.impactX.active).toEqual(true);
            asm.attackEventHandlers.handleImpactXChange(false);
            expect(state?.inputs.offense.impactX.active).toEqual(false);
        });

        it('handles impact x value change', () => {
            asm.attackEventHandlers.handleImpactXValueChange(9);
            expect(state?.inputs.offense.impactX.value).toEqual(9);
        });

        it('handles ion x change', () => {
            asm.attackEventHandlers.handleIonXChange(true);
            expect(state?.inputs.offense.ionX.active).toEqual(true);
            asm.attackEventHandlers.handleIonXChange(false);
            expect(state?.inputs.offense.ionX.active).toEqual(false);
        });

        it('handles ion x value change', () => {
            asm.attackEventHandlers.handleIonXValueChange(2);
            expect(state?.inputs.offense.ionX.value).toEqual(2);
        });

        it('handles jedi hunter change', () => {
            asm.attackEventHandlers.handleJediHunterChange(true);
            expect(state?.inputs.offense.jediHunter).toEqual(true);
            asm.attackEventHandlers.handleJediHunterChange(false);
            expect(state?.inputs.offense.jediHunter).toEqual(false);
        });

        it('handles lethal x change', () => {
            asm.attackEventHandlers.handleLethalXChange(true);
            expect(state?.inputs.offense.lethalX.active).toEqual(true);
            asm.attackEventHandlers.handleLethalXChange(false);
            expect(state?.inputs.offense.lethalX.active).toEqual(false);
        });

        it('handles lethal x value change', () => {
            asm.attackEventHandlers.handleLethalXValueChange(2);
            expect(state?.inputs.offense.lethalX.value).toEqual(2);
        });

        it('handles makashi mastery change', () => {
            asm.attackEventHandlers.handleMakashiMasteryChange(true);
            expect(state?.inputs.offense.makashiMastery).toEqual(true);
            asm.attackEventHandlers.handleMakashiMasteryChange(false);
            expect(state?.inputs.offense.makashiMastery).toEqual(false);
        });

        it('handles pierce x change', () => {
            asm.attackEventHandlers.handlePierceXChange(true);
            expect(state?.inputs.offense.pierceX.active).toEqual(true);
            asm.attackEventHandlers.handlePierceXChange(false);
            expect(state?.inputs.offense.pierceX.active).toEqual(false);
        });

        it('handles pierce x value change', () => {
            asm.attackEventHandlers.handlePierceXValueChange(3);
            expect(state?.inputs.offense.pierceX.value).toEqual(3);
        });

        it('handles precise x change', () => {
            asm.attackEventHandlers.handlePreciseXChange(true);
            expect(state?.inputs.offense.preciseX.active).toEqual(true);
            asm.attackEventHandlers.handlePreciseXChange(false);
            expect(state?.inputs.offense.preciseX.active).toEqual(false);
        });

        it('handles precise x value change', () => {
            asm.attackEventHandlers.handlePreciseXValueChange(2);
            expect(state?.inputs.offense.preciseX.value).toEqual(2);
        });

        it('handles ram x change', () => {
            asm.attackEventHandlers.handleRamXChange(true);
            expect(state?.inputs.offense.ramX.active).toEqual(true);
            asm.attackEventHandlers.handleRamXChange(false);
            expect(state?.inputs.offense.ramX.active).toEqual(false);
        });

        it('handles ram x value change', () => {
            asm.attackEventHandlers.handleRamXValueChange(2);
            expect(state?.inputs.offense.ramX.value).toEqual(2);
        });

        it('handles sharpshooter x change', () => {
            asm.attackEventHandlers.handleSharpshooterXChange(true);
            expect(state?.inputs.offense.sharpshooterX.active).toEqual(true);
            asm.attackEventHandlers.handleSharpshooterXChange(false);
            expect(state?.inputs.offense.sharpshooterX.active).toEqual(false);
        });

        it('handles sharpshooter x value change', () => {
            asm.attackEventHandlers.handleSharpshooterXValueChange(2);
            expect(state?.inputs.offense.sharpshooterX.value).toEqual(2);
        });
    });
});
