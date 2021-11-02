import * as SSM from '../../components/SimulatorStateManager';

export function createMockSimulatorStateAttackEventHandlers(): SSM.SimulatorStateAttackEventHandlers {
    return {
        resetDiceCount: jest.fn(),
        incrementRedDice: jest.fn(),
        incrementBlackDice: jest.fn(),
        incrementWhiteDice: jest.fn(),
        handleSurgeConversionChange: jest.fn(),
        resetTokenCounts: jest.fn(),
        incrementAimTokenCount: jest.fn(),
        incrementSurgeTokenCount: jest.fn(),
        handleBlastChange: jest.fn(),
        handleCriticalXChange: jest.fn(),
        handleCriticalXValueChange: jest.fn(),
        handleDuelistChange: jest.fn(),
        handleHighVelocityChange: jest.fn(),
        handleImpactXChange: jest.fn(),
        handleImpactXValueChange: jest.fn(),
        handleIonXChange: jest.fn(),
        handleIonXValueChange: jest.fn(),
        handleJediHunterChange: jest.fn(),
        handleLethalXChange: jest.fn(),
        handleLethalXValueChange: jest.fn(),
        handleMakashiMasteryChange: jest.fn(),
        handleMarksmanChange: jest.fn(),
        handlePierceXChange: jest.fn(),
        handlePierceXValueChange: jest.fn(),
        handlePreciseXChange: jest.fn(),
        handlePreciseXValueChange: jest.fn(),
        handleRamXChange: jest.fn(),
        handleRamXValueChange: jest.fn(),
        handleSharpshooterXChange: jest.fn(),
        handleSharpshooterXValueChange: jest.fn(),
    }
}

export function createMockSimulatorStateDefenseEventHandlers(): SSM.SimulatorStateDefenseEventHandlers {
    return {
        changeDie: jest.fn(),
        resetTokenCount: jest.fn(),
        incrementDodgeTokenCount: jest.fn(),
        incrementObservationTokenCount: jest.fn(),
        incrementShieldTokenCount: jest.fn(),
        incrementSuppressionTokenCount: jest.fn(),
        incrementSurgeTokenCount: jest.fn(),
        handleCoverChange: jest.fn(),
        handleArmorChange: jest.fn(),
        handleArmorXChange: jest.fn(),
        handleArmorXValueChange: jest.fn(),
        handleBlockChange: jest.fn(),
        handleDangerSenseXChange: jest.fn(),
        handleDangerSenseXValueChange: jest.fn(),
        handleDeflectChange: jest.fn(),
        handleDjemSoMasteryChange: jest.fn(),
        handleDuelistChange: jest.fn(),
        handleHasForceUpgradesChange: jest.fn(),
        handleImmuneBlastChange: jest.fn(),
        handleImmuneMeleePierceChange: jest.fn(),
        handleImmunePierceChange: jest.fn(),
        handleImperviousChange: jest.fn(),
        handleLowProfileChange: jest.fn(),
        handleOutmaneuverChange: jest.fn(),
        handleSoresuMasteryChange: jest.fn(),
        handleUncannyLuckXChange: jest.fn(),
        handleUncannyLuckXValueChange: jest.fn(),
    }
}

export function createMockSimulatorStateCombatEventHandlers(): SSM.SimulatorStateCombatEventHandlers {
    return {
        handleGuardianXChange: jest.fn(),
        handleGuardianXValueChange: jest.fn(),
        handleMeleeAttackChange: jest.fn(),
    }
}

export function createMockSimulatorStateBehaviorEventHandlers(): SSM.SimulatorStateBehaviorEventHandlers {
    return {
        handleDiceCountChange: jest.fn(),
        handleShowExpectedRangeChanged: jest.fn(),
        handleShowSimplifiedViewChange: jest.fn(),
    }
}
