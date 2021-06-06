import Cookies from 'js-cookie';

import * as T from '../code/Types';
import * as UP from '../code/profiles/UnitProfile'

export type AppState = {
    inputs: T.AttackInput,
    outputs: T.CombinedAttackOutput,
    diceRolls: number,
    resultsVisibility: T.ResultOutput,
    showExpectedRange: boolean,
    showSimpleView: boolean,
};

export type AppStateAttackEventHandlers = {
    resetDiceCount: () => void,
    incrementRedDice: () => void,
    incrementBlackDice: () => void,
    incrementWhiteDice: () => void,
    resetTokenCounts: () => void,
    incrementAimTokenCount: () => void,
    incrementSurgeTokenCount: () => void,
    handleSurgeConversionChange: (value: T.AttackSurgeConversion) => void,
    handleBlastChange: (active: boolean) => void,
    handleCriticalXChange: (active: boolean) => void,
    handleCriticalXValueChange: (value: number) => void,
    handleDuelistChange: (active: boolean) => void,
    handleHighVelocityChange: (active: boolean) => void,
    handleImpactXChange: (active: boolean) => void,
    handleImpactXValueChange: (value: number) => void,
    handleIonXChange: (active: boolean) => void,
    handleIonXValueChange: (value: number) => void,
    handleJediHunterChange: (active: boolean) => void,
    handleLethalXChange: (active: boolean) => void,
    handleLethalXValueChange: (value: number) => void,
    handleMakashiMasteryChange: (active: boolean) => void,
    handlePierceXChange: (active: boolean) => void,
    handlePierceXValueChange: (value: number) => void,
    handlePreciseXChange: (active: boolean) => void,
    handlePreciseXValueChange: (value: number) => void,
    handleRamXChange: (active: boolean) => void,
    handleRamXValueChange: (value: number) => void,
    handleSharpshooterXChange: (active: boolean) => void,
    handleSharpshooterXValueChange: (value: number) => void,
};

export type AppStateDefenseEventHandlers = {
    changeDie: () => void,
    resetTokenCount: () => void,
    incrementDodgeTokenCount: () => void,
    incrementObservationTokenCount: () => void,
    incrementShieldTokenCount: () => void,
    incrementSuppressionTokenCount: () => void,
    incrementSurgeTokenCount: () => void,
    handleCoverChange: (cover: T.Cover) => void,
    handleArmorChange: (active: boolean) => void,
    handleArmorXChange: (active: boolean) => void,
    handleArmorXValueChange: (value: number) => void,
    handleBlockChange: (active: boolean) => void,
    handleDangerSenseXChange: (active: boolean) => void,
    handleDangerSenseXValueChange: (value: number) => void,
    handleDeflectChange: (active: boolean) => void,
    handleDjemSoMasteryChange: (active: boolean) => void,
    handleDuelistChange: (active: boolean) => void,
    handleHasForceUpgradesChange: (active: boolean) => void,
    handleImmuneBlastChange: (active: boolean) => void,
    handleImmunePierceChange: (active: boolean) => void,
    handleImperviousChange: (active: boolean) => void,
    handleLowProfileChange: (active: boolean) => void,
    handleOutmaneuverChange: (active: boolean) => void,
    handleSoresuMasteryChange: (active: boolean) => void,
    handleUncannyLuckXChange: (active: boolean) => void,
    handleUncannyLuckXValueChange: (value: number) => void,
};

export type AppStateCombatEventHandlers = {
    handleGuardianXChange: (active: boolean) => void,
    handleGuardianXValueChange: (value: number) => void,
    handleMeleeAttackChange: (isMeleeAttack: boolean) => void,
};

export type AppStateBehaviorEventHandlers = {
    handleDiceCountChange: (count: number) => void,
    handleShowExpectedRangeChanged: (show: boolean) => void,
    handleShowSimplifiedViewChange: (show: boolean) => void,
};

export type UpdateStateFunction = (newState: AppState) => void;

type AppSettings = {
    showExpectedRange: boolean,
    showSimpleView: boolean,
};

export class AppStateManager {
    private _setState: UpdateStateFunction;
    private _state: AppState;
    private _attackEventHandlers: AppStateAttackEventHandlers;
    private _defenseEventHandlers: AppStateDefenseEventHandlers;
    private _combatEventHandlers: AppStateCombatEventHandlers;
    private _behaviorEventHandlers: AppStateBehaviorEventHandlers;

    public get state() : AppState { return this._state; }

    public get attackEventHandlers() : AppStateAttackEventHandlers { return this._attackEventHandlers; }

    public get defenseEventHandlers() : AppStateDefenseEventHandlers { return this._defenseEventHandlers; }

    public get combatEventHandlers() : AppStateCombatEventHandlers { return this._combatEventHandlers; }

    public get behaviorEventHandlers() : AppStateBehaviorEventHandlers { return this._behaviorEventHandlers; }

    constructor(updateStateFunction: UpdateStateFunction) {
        this._setState = updateStateFunction;

        // read settings
        const settings = this.loadSettings();

        // create default state
        this._state = {
            inputs: T.createDefaultAttackInput(),
            outputs: {
                firstAttack: {
                    attack: {
                        criticals: 0,
                        hits: 0,
                        surges: 0,
                        misses: 0,
                    },
                    defense: {
                        forcedSaves: 0,
                        blocks: 0,
                        surges: 0,
                        blanks: 0,
                        wounds: 0,
                    },
                },
                summary: {
                    attackCount: 0,
                    critical: [],
                    hit: [],
                    attackSurge: [],
                    forcedSaves: [],
                    forcedSaveStats: {
                        mean: 0,
                        median: 0,
                        stddev: 0,
                    },
                    blocks: [],
                    defenseSurge: [],
                    wounds: [],
                    woundStats: {
                        mean: 0,
                        median: 0,
                        stddev: 0,
                    },
                }
            },
            diceRolls: 10000,
            resultsVisibility: T.ResultOutput.None,
            showExpectedRange: settings.showExpectedRange,
            showSimpleView: settings.showSimpleView,
        }

        // create event handler objects
        this._attackEventHandlers = this.createAttackEventHandlers();
        this._defenseEventHandlers = this.createDefenseEventHandlers();
        this._combatEventHandlers = this.createCombatEventHandlers();
        this._behaviorEventHandlers = this.createBehaviorEventHandlers();
    }

    public updateOutputs(outputs: T.CombinedAttackOutput) : void {
        const newState = this.cloneState();
        newState.outputs = outputs;
        newState.resultsVisibility = this.state.diceRolls === 1 ? T.ResultOutput.Single : T.ResultOutput.Graph;
        this.setState(newState);
    }

    public applyAttackStateProfile(profile: UP.UnitProfile, weapon: UP.Weapon) : void {
        const newState = this.cloneState();
        function getValueX(value: number | null | undefined) : T.AbilityX {
            return value ? { active: true, value: value } : { active: false, value: 1 };
        }
        newState.inputs.offense = {
            redDice: weapon.dice.red,
            blackDice: weapon.dice.black,
            whiteDice: weapon.dice.white,
            surge: UP.convertUnitProfileSurgeToAttackSurge(profile.attackSurge),
            tokens: newState.inputs.offense.tokens,
            blast: false,   // TODO: ...
            criticalX: { active: false, value: 1 }, // TODO: ...
            duelist: false, // TODO: ...
            highVelocity: false,    // TODO: ...
            impactX: getValueX(weapon.keywords?.impact),
            ionX: { active: false, value: 1 },  // TODO: ...
            jediHunter: false,  // TODO: ...
            lethalX: getValueX(weapon.keywords?.lethal),
            makashiMastery: false,  // TODO: ...
            pierceX: getValueX(weapon.keywords?.pierce),
            preciseX: { active: false, value: 1 },  // TODO: ...
            ramX: { active: false, value: 1 },  // TODO: ...
            sharpshooterX: getValueX(profile.keywords?.sharpshooter)
        };
        newState.inputs.combat.meleeAttack = weapon.maximumRange !== null ? weapon.maximumRange === 0 : false;
        this.setState(newState);
    }

    private setState(newState: AppState) {
        this._state = newState;
        this._setState(newState);
    }

    private cloneArray<T>(ar: Array<T>): Array<T> {
        const newArray: Array<T> = [];
        for (let i = 0; i < ar.length; i++) {
            newArray[i] = ar[i];
        }
        return newArray;
    }

    private cloneState(): AppState {
        return {
            inputs: T.cloneAttackInput(this.state.inputs),
            outputs: {
                firstAttack: {
                    attack: {
                        criticals: this.state.outputs.firstAttack.attack.criticals,
                        hits: this.state.outputs.firstAttack.attack.hits,
                        surges: this.state.outputs.firstAttack.attack.surges,
                        misses: this.state.outputs.firstAttack.attack.misses,
                    },
                    defense: {
                        forcedSaves: this.state.outputs.firstAttack.defense.forcedSaves,
                        blocks: this.state.outputs.firstAttack.defense.blocks,
                        surges: this.state.outputs.firstAttack.defense.surges,
                        blanks: this.state.outputs.firstAttack.defense.blanks,
                        wounds: this.state.outputs.firstAttack.defense.wounds,
                    },
                },
                summary: {
                    attackCount: this.state.outputs.summary.attackCount,
                    critical: this.cloneArray(this.state.outputs.summary.critical),
                    hit: this.cloneArray(this.state.outputs.summary.hit),
                    attackSurge: this.cloneArray(this.state.outputs.summary.attackSurge),
                    forcedSaves: this.cloneArray(this.state.outputs.summary.forcedSaves),
                    forcedSaveStats: {
                        mean: this.state.outputs.summary.forcedSaveStats.mean,
                        median: this.state.outputs.summary.forcedSaveStats.median,
                        stddev: this.state.outputs.summary.forcedSaveStats.stddev,
                    },
                    blocks: this.cloneArray(this.state.outputs.summary.blocks),
                    defenseSurge: this.cloneArray(this.state.outputs.summary.defenseSurge),
                    wounds: this.cloneArray(this.state.outputs.summary.wounds),
                    woundStats: {
                        mean: this.state.outputs.summary.woundStats.mean,
                        median: this.state.outputs.summary.woundStats.median,
                        stddev: this.state.outputs.summary.woundStats.stddev,
                    },
                }
            },
            diceRolls: this.state.diceRolls,
            resultsVisibility: this.state.resultsVisibility,
            showExpectedRange: this.state.showExpectedRange,
            showSimpleView: this.state.showSimpleView,
        }
    }

    // attack event handlers
    private createAttackEventHandlers(): AppStateAttackEventHandlers {
        return {
            resetDiceCount: () => this.resetAttackDiceCount(),
            incrementRedDice: () => this.incrementRedAttackDice(),
            incrementBlackDice: () => this.incrementBlackAttackDice(),
            incrementWhiteDice: () => this.incrementWhiteAttackDice(),
            resetTokenCounts: () => this.resetAttackTokenCount(),
            incrementAimTokenCount: () => this.incrementAimTokenCount(),
            incrementSurgeTokenCount: () => this.incrementAttackSurgeTokenCount(),
            handleSurgeConversionChange: (value: T.AttackSurgeConversion) => this.handleAttackSurgeConversionChange(value),
            handleBlastChange: (active: boolean) => this.handleBlastChange(active),
            handleCriticalXChange: (active: boolean) => this.handleCriticalXChange(active),
            handleCriticalXValueChange: (value: number) => this.handleCriticalXValueChange(value),
            handleDuelistChange: (active: boolean) => this.handleDuelistAttackChange(active),
            handleHighVelocityChange: (active: boolean) => this.handleHighVelocityChange(active),
            handleImpactXChange: (active: boolean) => this.handleImpactXChange(active),
            handleImpactXValueChange: (value: number) => this.handleImpactXValueChange(value),
            handleIonXChange: (active: boolean) => this.handleIonXChange(active),
            handleIonXValueChange: (value: number) => this.handleIonXValueChange(value),
            handleJediHunterChange: (active: boolean) => this.handleJediHunterChange(active),
            handleLethalXChange: (active: boolean) => this.handleLethalXChange(active),
            handleLethalXValueChange: (value: number) => this.handleLethalXValueChange(value),
            handleMakashiMasteryChange: (active: boolean) => this.handleMakashiMasteryChange(active),
            handlePierceXChange: (active: boolean) => this.handlePierceXChange(active),
            handlePierceXValueChange: (value: number) => this.handlePierceXValueChange(value),
            handlePreciseXChange: (active: boolean) => this.handlePreciseXChange(active),
            handlePreciseXValueChange: (value: number) => this.handlePreciseXValueChange(value),
            handleRamXChange: (active: boolean) => this.handleRamXChange(active),
            handleRamXValueChange: (value: number) => this.handleRamXValueChange(value),
            handleSharpshooterXChange: (active: boolean) => this.handleSharpshooterXChange(active),
            handleSharpshooterXValueChange: (value: number) => this.handleSharpshooterXValueChange(value),
        };
    }

    private resetAttackDiceCount() {
        const newState = this.cloneState();
        newState.inputs.offense.redDice = 0;
        newState.inputs.offense.blackDice = 0;
        newState.inputs.offense.whiteDice = 0;
        this.setState(newState);
    }

    private incrementRedAttackDice() {
        const newState = this.cloneState();
        newState.inputs.offense.redDice++;
        this.setState(newState);
    }

    private incrementBlackAttackDice() {
        const newState = this.cloneState();
        newState.inputs.offense.blackDice++;
        this.setState(newState);
    }

    private incrementWhiteAttackDice() {
        const newState = this.cloneState();
        newState.inputs.offense.whiteDice++;
        this.setState(newState);
    }

    private resetAttackTokenCount() {
        const newState = this.cloneState();
        newState.inputs.offense.tokens.aim = 0;
        newState.inputs.offense.tokens.surge = 0;
        this.setState(newState);
    }

    private incrementAimTokenCount() {
        const newState = this.cloneState();
        newState.inputs.offense.tokens.aim++;
        this.setState(newState);
    }

    private incrementAttackSurgeTokenCount() {
        const newState = this.cloneState();
        newState.inputs.offense.tokens.surge++;
        this.setState(newState);
    }

    private handleAttackSurgeConversionChange(asc: T.AttackSurgeConversion) {
        const newState = this.cloneState();
        newState.inputs.offense.surge = asc;
        this.setState(newState);
    }

    private handleBlastChange(hasBlast: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.blast = hasBlast;
        this.setState(newState);
    }

    private handleCriticalXChange(hasCriticalX: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.criticalX.active = hasCriticalX;
        this.setState(newState);
    }

    private handleCriticalXValueChange(criticalXValue: number) {
        const newState = this.cloneState();
        newState.inputs.offense.criticalX.value = criticalXValue;
        this.setState(newState);
    }

    private handleDuelistAttackChange(hasDuelist: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.duelist = hasDuelist;
        this.setState(newState);
    }

    private handleHighVelocityChange(hasHighVelocity: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.highVelocity = hasHighVelocity;
        this.setState(newState);
    }

    private handleImpactXChange(hasImpactX: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.impactX.active = hasImpactX;
        this.setState(newState);
    }

    private handleImpactXValueChange(impactXValue: number) {
        const newState = this.cloneState();
        newState.inputs.offense.impactX.value = impactXValue;
        this.setState(newState);
    }

    private handleIonXChange(hasIonX: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.ionX.active = hasIonX;
        this.setState(newState);
    }

    private handleIonXValueChange(ionXValue: number) {
        const newState = this.cloneState();
        newState.inputs.offense.ionX.value = ionXValue;
        this.setState(newState);
    }

    private handleJediHunterChange(hasJediHunter: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.jediHunter = hasJediHunter;
        this.setState(newState);
    }

    private handleLethalXChange(hasLethalX: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.lethalX.active = hasLethalX;
        this.setState(newState);
    }

    private handleLethalXValueChange(lethalXValue: number) {
        const newState = this.cloneState();
        newState.inputs.offense.lethalX.value = lethalXValue;
        this.setState(newState);
    }

    private handleMakashiMasteryChange(hasMakashiMastery: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.makashiMastery = hasMakashiMastery;
        this.setState(newState);
    }

    private handlePierceXChange(hasPierceX: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.pierceX.active = hasPierceX;
        this.setState(newState);
    }

    private handlePierceXValueChange(pierceXValue: number) {
        const newState = this.cloneState();
        newState.inputs.offense.pierceX.value = pierceXValue;
        this.setState(newState);
    }

    private handlePreciseXChange(hasPreciseX: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.preciseX.active = hasPreciseX;
        this.setState(newState);
    }

    private handlePreciseXValueChange(preciseXValue: number) {
        const newState = this.cloneState();
        newState.inputs.offense.preciseX.value = preciseXValue;
        this.setState(newState);
    }

    private handleRamXChange(hasRamX: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.ramX.active = hasRamX;
        this.setState(newState);
    }

    private handleRamXValueChange(ramXValue: number) {
        const newState = this.cloneState();
        newState.inputs.offense.ramX.value = ramXValue;
        this.setState(newState);
    }

    private handleSharpshooterXChange(hasSharpshooterX: boolean) {
        const newState = this.cloneState();
        newState.inputs.offense.sharpshooterX.active = hasSharpshooterX;
        this.setState(newState);
    }

    private handleSharpshooterXValueChange(sharpshooterXValue: number) {
        const newState = this.cloneState();
        newState.inputs.offense.sharpshooterX.value = sharpshooterXValue;
        this.setState(newState);
    }

    // defense event handlers
    private createDefenseEventHandlers(): AppStateDefenseEventHandlers {
        return {
            changeDie: () => this.changeDefenseDie(),
            resetTokenCount: () => this.resetDefenseTokenCount(),
            incrementDodgeTokenCount: () => this.incrementDodgeTokenCount(),
            incrementObservationTokenCount: () => this.incrementObservationTokenCount(),
            incrementShieldTokenCount: () => this.incrementShieldTokenCount(),
            incrementSuppressionTokenCount: () => this.incrementSuppressionTokenCount(),
            incrementSurgeTokenCount: () => this.incrementDefenseSurgeTokenCount(),
            handleCoverChange: (cover: T.Cover) => this.handleCoverChange(cover),
            handleArmorChange: (active: boolean) => this.handleArmorChange(active),
            handleArmorXChange: (active: boolean) => this.handleArmorXChange(active),
            handleArmorXValueChange: (value: number) => this.handleArmorXValueChange(value),
            handleBlockChange: (active: boolean) => this.handleBlockChange(active),
            handleDangerSenseXChange: (active: boolean) => this.handleDangerSenseXChange(active),
            handleDangerSenseXValueChange: (value: number) => this.handleDangerSenseXValueChange(value),
            handleDeflectChange: (active: boolean) => this.handleDeflectChange(active),
            handleDjemSoMasteryChange: (active: boolean) => this.handleDjemSoMasteryChange(active),
            handleDuelistChange: (active: boolean) => this.handleDuelistDefenseChange(active),
            handleHasForceUpgradesChange: (active: boolean) => this.handleHasForceUpgradesChange(active),
            handleImmuneBlastChange: (active: boolean) => this.handleImmuneBlastChange(active),
            handleImmunePierceChange: (active: boolean) => this.handleImmunePierceChange(active),
            handleImperviousChange: (active: boolean) => this.handleImperviousChange(active),
            handleLowProfileChange: (active: boolean) => this.handleLowProfileChange(active),
            handleOutmaneuverChange: (active: boolean) => this.handleOutmaneuverChange(active),
            handleSoresuMasteryChange: (active: boolean) => this.handleSoresuMasteryChange(active),
            handleUncannyLuckXChange: (active: boolean) => this.handleUncannyLuckXChange(active),
            handleUncannyLuckXValueChange: (value: number) => this.handleUncannyLuckXValueChange(value),
        };
    }

    private changeDefenseDie() {
        const newState = this.cloneState();
        const isSurging = newState.inputs.defense.surge;
        newState.inputs.defense.surge = !isSurging;
        if (isSurging) {
            if (newState.inputs.defense.dieColor === T.DieColor.White) {
                newState.inputs.defense.dieColor = T.DieColor.Red;
            } else {
                newState.inputs.defense.dieColor = T.DieColor.White;
            }
        }
        this.setState(newState);
    }

    private resetDefenseTokenCount() {
        const newState = this.cloneState();
        newState.inputs.defense.tokens.dodge = 0;
        newState.inputs.defense.tokens.observation = 0;
        newState.inputs.defense.tokens.shield = 0;
        newState.inputs.defense.tokens.suppression = 0;
        newState.inputs.defense.tokens.surge = 0;
        this.setState(newState);
    }

    private incrementDodgeTokenCount() {
        const newState = this.cloneState();
        newState.inputs.defense.tokens.dodge++;
        this.setState(newState);
    }

    private incrementObservationTokenCount() {
        const newState = this.cloneState();
        newState.inputs.defense.tokens.observation++;
        this.setState(newState);
    }

    private incrementShieldTokenCount() {
        const newState = this.cloneState();
        newState.inputs.defense.tokens.shield++;
        this.setState(newState);
    }

    private incrementSuppressionTokenCount() {
        const newState = this.cloneState();
        newState.inputs.defense.tokens.suppression++;
        this.setState(newState);
    }

    private incrementDefenseSurgeTokenCount() {
        const newState = this.cloneState();
        newState.inputs.defense.tokens.surge++;
        this.setState(newState);
    }

    private handleCoverChange(cover: T.Cover) {
        const newState = this.cloneState();
        newState.inputs.defense.cover = cover;
        this.setState(newState);
    }

    private handleArmorChange(hasArmor: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.armor = hasArmor;
        if (hasArmor) {
            newState.inputs.defense.armorX.active = false;
        }
        this.setState(newState);
    }

    private handleArmorXChange(hasArmorX: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.armorX.active = hasArmorX;
        if (hasArmorX) {
            newState.inputs.defense.armor = false;
        }
        this.setState(newState);
    }

    private handleArmorXValueChange(armorXValue: number) {
        const newState = this.cloneState();
        newState.inputs.defense.armorX.value = armorXValue;
        this.setState(newState);
    }

    private handleBlockChange(hasBlock: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.block = hasBlock;
        if (hasBlock) {
            newState.inputs.defense.deflect = false;
            newState.inputs.defense.djemSoMastery = false;
            newState.inputs.defense.soresuMastery = false;
        }
        this.setState(newState);
    }

    private handleDangerSenseXChange(hasDangerSense: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.dangerSenseX.active = hasDangerSense;
        this.setState(newState);
    }

    private handleDangerSenseXValueChange(dangerSenseXValue: number) {
        const newState = this.cloneState();
        newState.inputs.defense.dangerSenseX.value = dangerSenseXValue;
        this.setState(newState);
    }

    private handleDeflectChange(hasDeflect: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.deflect = hasDeflect;
        if (hasDeflect) {
            newState.inputs.defense.block = false;
            newState.inputs.defense.djemSoMastery = false;
            newState.inputs.defense.soresuMastery = false;
        }
        this.setState(newState);
    }

    private handleDjemSoMasteryChange(hasDjemSoMastery: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.djemSoMastery = hasDjemSoMastery;
        if (hasDjemSoMastery) {
            newState.inputs.defense.block = false;
            newState.inputs.defense.deflect = false;
            newState.inputs.defense.soresuMastery = false;
        }
        this.setState(newState);
    }

    private handleDuelistDefenseChange(hasDuelist: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.duelist = hasDuelist;
        this.setState(newState);
    }

    private handleHasForceUpgradesChange(hasForceUpgrades: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.hasForceUpgrades = hasForceUpgrades;
        this.setState(newState);
    }

    private handleImmuneBlastChange(hasImmuneBlast: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.immuneBlast = hasImmuneBlast;
        this.setState(newState);
    }

    private handleImmunePierceChange(hasImmunePierce: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.immunePierce = hasImmunePierce;
        if (hasImmunePierce) {
            newState.inputs.defense.impervious = false;
        }
        this.setState(newState);
    }

    private handleImperviousChange(hasImpervious: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.impervious = hasImpervious;
        if (hasImpervious) {
            newState.inputs.defense.immunePierce = false;
        }
        this.setState(newState);
    }

    private handleLowProfileChange(hasLowProfile: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.lowProfile = hasLowProfile;
        this.setState(newState);
    }

    private handleOutmaneuverChange(hasOutmaneuver: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.outmaneuver = hasOutmaneuver;
        this.setState(newState);
    }

    private handleSoresuMasteryChange(hasSoresuMastery: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.soresuMastery = hasSoresuMastery;
        if (hasSoresuMastery) {
            newState.inputs.defense.block = false;
            newState.inputs.defense.deflect = false;
            newState.inputs.defense.djemSoMastery = false;
        }
        this.setState(newState);
    }

    private handleUncannyLuckXChange(hasUncannyLuckX: boolean) {
        const newState = this.cloneState();
        newState.inputs.defense.uncannyLuckX.active = hasUncannyLuckX;
        this.setState(newState);
    }

    private handleUncannyLuckXValueChange(uncannyLuckXValue: number) {
        const newState = this.cloneState();
        newState.inputs.defense.uncannyLuckX.value = uncannyLuckXValue;
        this.setState(newState);
    }

    // combat event handlers
    private createCombatEventHandlers(): AppStateCombatEventHandlers {
        return {
            handleGuardianXChange: (active: boolean) => this.handleGuardianXChange(active),
            handleGuardianXValueChange: (value: number) => this.handleGuardianXValueChange(value),
            handleMeleeAttackChange: (isMeleeAttack: boolean) => this.handleMeleeAttackChange(isMeleeAttack),
        }
    }

    private handleGuardianXChange(active: boolean) {
        const newState = this.cloneState();
        newState.inputs.combat.guardian.active = active;
        this.setState(newState);
    }

    private handleGuardianXValueChange(value: number) {
        const newState = this.cloneState();
        newState.inputs.combat.guardian.value = value;
        this.setState(newState);
    }

    private handleMeleeAttackChange(isMeleeAttack: boolean) {
        const newState = this.cloneState();
        newState.inputs.combat.meleeAttack = isMeleeAttack;
        this.setState(newState);
    }

    // behavior event handlers
    private createBehaviorEventHandlers(): AppStateBehaviorEventHandlers {
        return {
            handleDiceCountChange: (count: number) => this.handleDiceCountChange(count),
            handleShowExpectedRangeChanged: (show: boolean) => this.handleShowExpectedRangeChanged(show),
            handleShowSimplifiedViewChange: (show: boolean) => this.handleShowSimplifiedViewChange(show),
        }
    }

    private handleDiceCountChange(count: number) {
        const newState = this.cloneState();
        newState.diceRolls = count;
        this.setState(newState);
    }

    private handleShowExpectedRangeChanged(show: boolean) {
        const newState = this.cloneState();
        newState.showExpectedRange = show;
        const newSettings = this.getActiveSettings();
        newSettings.showExpectedRange = show;
        this.saveSettings(newSettings);
        this.setState(newState);
    }

    private handleShowSimplifiedViewChange(show: boolean) {
        const newState = this.cloneState();
        newState.showSimpleView = show;
        const newSettings = this.getActiveSettings();
        newSettings.showSimpleView = show;
        this.saveSettings(newSettings);
        this.setState(newState);
    }

    private getActiveSettings() : AppSettings {
        return {
            showExpectedRange: this._state.showExpectedRange,
            showSimpleView: this._state.showSimpleView,
        };
    }

    private loadSettings() : AppSettings {
        const settingsString = window.localStorage.getItem('settings');
        const settingsObject = {
            showExpectedRange: true,
            showSimpleView: false,
        };

        if(settingsString === null) {
            const showExpectedRangeCookie = Cookies.get('showExpectedRange');
            if(showExpectedRangeCookie !== undefined) {
                settingsObject.showExpectedRange = showExpectedRangeCookie === 'true';
            }
    
            const showSimpleViewCookie = Cookies.get('showSimpleView');
            if(showSimpleViewCookie !== undefined) {
                settingsObject.showSimpleView = showSimpleViewCookie === 'true';
            }
        } else {
            try {
                const rawObject = JSON.parse(settingsString);
                if(rawObject.hasOwnProperty('showExpectedRange')) {
                    settingsObject.showExpectedRange = Boolean(rawObject['showExpectedRange']).valueOf();
                }
                if(rawObject.hasOwnProperty('showSimpleView')) {
                    settingsObject.showSimpleView = Boolean(rawObject['showSimpleView']).valueOf();
                }
            } catch { }
        }

        return settingsObject;
    }

    private saveSettings(settings: AppSettings) {
        window.localStorage.setItem('settings', JSON.stringify(settings));
    }
}
