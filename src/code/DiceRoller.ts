import * as T from './Types';
import * as RS from './RerollStrategy';
import * as EC from './EffectiveCover';
import * as DRT from './DiceRollerTypes';
import RerollStrategyFactory from './RerollStrategyFactory';
import * as RSH from "./RerollStrategyHelpers";
import { computeStats } from './Stats';
import DiceModificationMatrix from './DiceModificationMatrix';

export type RollAttackDieFunction = (color: T.DieColor) => T.AttackDieResult;
export type RollDefenseDieFunction = (color: T.DieColor) => T.DefenseDieResult;

function createDefaultStatus(): DRT.AttackResultStatus {
    return {
        attackResult: {
            criticals: 0,
            hits: 0,
            surges: 0,
            misses: 0,
        },
        modificationMatrix: new DiceModificationMatrix([]),
        defenseResult: {
            forcedSaves: 0,
            blocks: 0,
            surges: 0,
            blanks: 0,
            wounds: 0,
        },
        modifiedDefenseResult: {
            blocks: 0,
            surges: 0,
            blanks: 0,
        },
    };
}

function createDefaultOutput(): T.AttackOutput {
    return {
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
        }
    }
}

function createDefaultAttackSummary(): T.AttackSummary {
    return {
        attackCount: 0,
        critical: [],
        hit: [],
        attackSurge: [],
        forcedSaves: [],
        forcedSaveStats: {
            mean: 1,
            median: 1,
            stddev: 1,
        },
        blocks: [],
        defenseSurge: [],
        wounds: [],
        woundStats: {
            mean: 1,
            median: 1,
            stddev: 1,
        },
    };
}

function incrementArrayValue(ar: number[], index: number) {
    if (ar[index] === undefined) {
        ar[index] = 1;
    } else {
        ar[index] = ar[index] + 1;
    }
}

export class DiceRoller {
    private rollAttackDieFunction: RollAttackDieFunction;
    private rollDefenseDieFunction: RollDefenseDieFunction;

    constructor() {
        this.rollAttackDieFunction = this.defaultRollAttackDie;
        this.rollDefenseDieFunction = this.defaultRollDefenseDie;
    }

    public get rollAttackDie(): RollAttackDieFunction {
        return this.rollAttackDieFunction;
    }

    public set rollAttackDie(newFunction: RollAttackDieFunction) {
        this.rollAttackDieFunction = newFunction;
    }

    public get rollDefenseDie(): RollDefenseDieFunction {
        return this.rollDefenseDieFunction;
    }

    public set rollDefenseDie(newFunction: RollDefenseDieFunction) {
        this.rollDefenseDieFunction = newFunction;
    }

    public simulateAttacks(count: number, input: T.AttackInput): T.CombinedAttackOutput {
        // cumulative values
        const forcedSavesArray: number[] = [];
        const woundsArray: number[] = [];
        let firstAttackOutput = createDefaultOutput();
        const attackSummary = createDefaultAttackSummary();

        for (let i = 0; i < count; i++) {
            // tracking values
            const modifiedInput = T.cloneAttackInput(input);
            const status = createDefaultStatus();

            // these functions match the steps under 'Attack' in the RRG
            this.rollAttackDice(input, modifiedInput, status);
            this.applyDodgeAndCover(input, modifiedInput, status);
            this.modifyAttackDice(input, modifiedInput, status);
            status.defenseResult.forcedSaves =
                (status.modificationMatrix.getResultCount(T.AttackDieResult.Critical)) +
                (status.modificationMatrix.getResultCount(T.AttackDieResult.Hit));
            this.rollDefenseDice(input, modifiedInput, status);
            this.modifyDefenseDice(input, modifiedInput, status);
            this.compareResults(status);

            const output: T.AttackOutput = {
                attack: status.attackResult,
                defense: status.defenseResult,
            };

            if (i === 0) {
                firstAttackOutput = output;
            }
            incrementArrayValue(attackSummary.critical, output.attack.criticals);
            incrementArrayValue(attackSummary.hit, output.attack.hits);
            incrementArrayValue(attackSummary.attackSurge, output.attack.surges);
            incrementArrayValue(attackSummary.forcedSaves, output.defense.forcedSaves);
            incrementArrayValue(attackSummary.blocks, output.defense.blocks);
            incrementArrayValue(attackSummary.defenseSurge, output.defense.surges);
            incrementArrayValue(attackSummary.wounds, output.defense.wounds);
            forcedSavesArray.push(output.defense.forcedSaves);
            woundsArray.push(output.defense.wounds);
        }

        attackSummary.attackCount = count;
        attackSummary.forcedSaveStats = computeStats(forcedSavesArray);
        attackSummary.woundStats = computeStats(woundsArray);

        let maxCount = Math.max(attackSummary.critical.length, attackSummary.hit.length);
        maxCount = Math.max(maxCount, attackSummary.attackSurge.length);
        maxCount = Math.max(maxCount, attackSummary.forcedSaves.length);
        maxCount = Math.max(maxCount, attackSummary.blocks.length);
        maxCount = Math.max(maxCount, attackSummary.defenseSurge.length);
        maxCount = Math.max(maxCount, attackSummary.wounds.length);

        for (let i = maxCount - 1; i >= 0; i--) {
            if (attackSummary.critical[i] === undefined && attackSummary.critical[i + 1] !== undefined) { attackSummary.critical[i] = 0; }
            if (attackSummary.hit[i] === undefined && attackSummary.hit[i + 1] !== undefined) { attackSummary.hit[i] = 0; }
            if (attackSummary.attackSurge[i] === undefined && attackSummary.attackSurge[i + 1] !== undefined) { attackSummary.attackSurge[i] = 0; }
            if (attackSummary.forcedSaves[i] === undefined && attackSummary.forcedSaves[i + 1] !== undefined) { attackSummary.forcedSaves[i] = 0; }
            if (attackSummary.blocks[i] === undefined && attackSummary.blocks[i + 1] !== undefined) { attackSummary.blocks[i] = 0; }
            if (attackSummary.defenseSurge[i] === undefined && attackSummary.defenseSurge[i + 1] !== undefined) { attackSummary.defenseSurge[i] = 0; }
            if (attackSummary.wounds[i] === undefined && attackSummary.wounds[i + 1] !== undefined) { attackSummary.wounds[i] = 0; }
        }

        return {
            firstAttack: firstAttackOutput,
            summary: attackSummary,
        };
    }

    private defaultRollAttackDie(color: T.DieColor): T.AttackDieResult {
        const number = Math.floor(Math.random() * Math.floor(8));
        if (number === 7) {
            return T.AttackDieResult.Critical;
        }
        if (number === 6) {
            return T.AttackDieResult.Surge;
        }
        if ((number === 0 && color === T.DieColor.White) ||
            (number <= 2 && color === T.DieColor.Black) ||
            (number <= 4 && color === T.DieColor.Red)) {
            return T.AttackDieResult.Hit;
        }
        return T.AttackDieResult.Miss;
    }

    private defaultRollDefenseDie(color: T.DieColor): T.DefenseDieResult {
        const number = Math.floor(Math.random() * Math.floor(6));
        if (number === 5) {
            return T.DefenseDieResult.Surge;
        }
        if ((number === 0 && color === T.DieColor.White) ||
            (number <= 2 && color === T.DieColor.Red)) {
            return T.DefenseDieResult.Block;
        }
        return T.DefenseDieResult.Blank;
    }

    private rollAttackDice(input: T.AttackInput, modifiedInput: T.AttackInput, status: DRT.AttackResultStatus) {
        // 1. Roll dice

        // makashi mastery
        if (modifiedInput.offense.makashiMastery && modifiedInput.combat.meleeAttack &&
            modifiedInput.offense.pierceX.active && modifiedInput.offense.pierceX.value > 1 &&
            (modifiedInput.defense.immunePierce || modifiedInput.defense.impervious)) {
            modifiedInput.offense.pierceX.value--;
            modifiedInput.defense.immunePierce = false;
            modifiedInput.defense.impervious = false;
        }

        // initialize
        const rolls: T.AttackRoll[] = [];
        for (let i = 0; i < input.offense.redDice; i++) {
            rolls.push({ color: T.DieColor.Red, result: T.AttackDieResult.Miss });
        }
        for (let i = 0; i < input.offense.blackDice; i++) {
            rolls.push({ color: T.DieColor.Black, result: T.AttackDieResult.Miss });
        }
        for (let i = 0; i < input.offense.whiteDice; i++) {
            rolls.push({ color: T.DieColor.White, result: T.AttackDieResult.Miss });
        }

        // roll dice
        for (let i = 0; i < rolls.length; i++) {
            rolls[i].result = this.rollAttackDie(rolls[i].color);
        }

        // 2. Reroll dice
        this.rerollAttackDice(modifiedInput, rolls);

        // summarize results
        for (let i = 0; i < rolls.length; i++) {
            if (rolls[i].result === T.AttackDieResult.Critical) {
                status.attackResult.criticals++;
            } else if (rolls[i].result === T.AttackDieResult.Hit) {
                status.attackResult.hits++;
            } else if (rolls[i].result === T.AttackDieResult.Surge) {
                status.attackResult.surges++;
            } else {
                status.attackResult.misses++;
            }
        }
        status.modificationMatrix = new DiceModificationMatrix(rolls);

        // 3. Convert attack surges
        this.convertAttackSurges(input, modifiedInput, status);

        // duelist (attack)
        if (modifiedInput.offense.duelist && modifiedInput.combat.meleeAttack) {
            // if we have not spent an aim token but have one, spend it to activate duelist
            if (modifiedInput.offense.tokens.aim === input.offense.tokens.aim && input.offense.tokens.aim > 0) {
                modifiedInput.offense.tokens.aim--;
            }

            if (modifiedInput.offense.tokens.aim < input.offense.tokens.aim) {
                if (modifiedInput.offense.pierceX.active) {
                    modifiedInput.offense.pierceX.value++;
                } else {
                    modifiedInput.offense.pierceX.active = true;
                    modifiedInput.offense.pierceX.value = 1;
                }
            }
        }

        // 3.5 After Convert Attack Surge, before Apply Dodge and Cover

        // marksman
        if(modifiedInput.offense.marksman) {
            RSH.convertMarksman(modifiedInput, status, {
                aimTokens: modifiedInput.offense.tokens.aim,
                observationTokens: modifiedInput.defense.tokens.observation
            });
        }
    }

    private rerollAttackDice(modifiedInput: T.AttackInput, rolls: T.AttackRoll[]) {
        const remaining: RS.RemainingRerolls = {
            aimTokens: modifiedInput.offense.tokens.aim,
            observationTokens: modifiedInput.defense.tokens.observation,
        };

        if (modifiedInput.offense.lethalX.active) {
            this.rerollForObservationTokens(modifiedInput, rolls, remaining);
            this.rerollForAimTokens(modifiedInput, rolls, remaining);
        } else {
            this.rerollForAimTokens(modifiedInput, rolls, remaining);
            this.rerollForObservationTokens(modifiedInput, rolls, remaining);
        }
    }

    private rerollForObservationTokens(modifiedInput: T.AttackInput, rolls: T.AttackRoll[], remaining: RS.RemainingRerolls): void {
        for (let i = 0; i < modifiedInput.defense.tokens.observation; i++) {
            if (!this.rerollAttackDiceWithStrategy(modifiedInput, rolls, 1, RS.RerollReason.ObservationToken, remaining)) {
                break;
            }
            remaining.observationTokens--;
        }
    }

    private rerollForAimTokens(modifiedInput: T.AttackInput, rolls: T.AttackRoll[], remaining: RS.RemainingRerolls): void {
        for (let i = 0; i < modifiedInput.offense.tokens.aim; i++) {
            let rerollDiceCount = 2;

            // precise keyword
            if (modifiedInput.offense.preciseX.active) {
                rerollDiceCount += modifiedInput.offense.preciseX.value;
            }

            if (!this.rerollAttackDiceWithStrategy(modifiedInput, rolls, rerollDiceCount, RS.RerollReason.AimToken, remaining)) {
                break;
            }
            remaining.aimTokens--;
        }
    }

    private rerollAttackDiceWithStrategy(modifiedInput: T.AttackInput,
        rolls: T.AttackRoll[],
        count: number,
        reason: RS.RerollReason,
        remaining: RS.RemainingRerolls): boolean {
        let indexes: number[] | undefined = undefined;
        const factory = new RerollStrategyFactory();
        const rerollStrategy = factory.selectStrategy(modifiedInput, reason);

        indexes = rerollStrategy.pickRerollDice(modifiedInput, rolls, count, reason, remaining);
        if (indexes !== undefined) {
            for (let i = 0; i < indexes.length; i++) {
                const index = indexes[i];
                rolls[index].result = this.rollAttackDie(rolls[index].color);
            }
            return true;
        }
        return false;
    }

    private convertAttackSurges(input: T.AttackInput, modifiedInput: T.AttackInput, status: DRT.AttackResultStatus) {
        // critical X
        if (modifiedInput.offense.criticalX.active) {
            status.modificationMatrix.tryConvertResultCount(
                T.AttackDieResult.Surge, T.AttackDieResult.Critical, modifiedInput.offense.criticalX.value);
        }

        // surge -> crit
        let surgeToCrit = (modifiedInput.offense.surge === T.AttackSurgeConversion.Critical);

        // jedi hunter
        surgeToCrit = surgeToCrit || (modifiedInput.offense.jediHunter && modifiedInput.defense.hasForceUpgrades);

        if (surgeToCrit) {
            status.modificationMatrix.tryConvertResultAllExcept(T.AttackDieResult.Surge, T.AttackDieResult.Critical, 0);
        }

        // surge -> hit
        if (!surgeToCrit && modifiedInput.offense.surge === T.AttackSurgeConversion.Hit) {
            status.modificationMatrix.tryConvertResultAllExcept(T.AttackDieResult.Surge, T.AttackDieResult.Hit, 0);
        }

        // surge tokens
        if (modifiedInput.offense.tokens.surge > 0) {
            modifiedInput.offense.surge -=
                status.modificationMatrix.tryConvertResultCount(
                    T.AttackDieResult.Surge, T.AttackDieResult.Hit, modifiedInput.offense.tokens.surge);
        }

        // surge -> miss
        status.modificationMatrix.tryConvertResultAllExcept(T.AttackDieResult.Surge, T.AttackDieResult.Miss, 0);
    }

    private applyDodgeAndCover(input: T.AttackInput, modifiedInput: T.AttackInput, status: DRT.AttackResultStatus) {
        // cover
        const effectiveCover = EC.getEffectiveCover(modifiedInput);
        const effectiveCoverValue = EC.getCoverModification(effectiveCover);
        if (effectiveCoverValue > 0) {
            status.modificationMatrix.tryConvertResultCount(T.AttackDieResult.Hit, T.AttackDieResult.Miss, effectiveCoverValue);
        }

        // dodge tokens & high velocity
        if (!modifiedInput.offense.highVelocity && modifiedInput.defense.tokens.dodge > 0) {
            // outmaneuver
            if (modifiedInput.defense.outmaneuver) {
                modifiedInput.defense.tokens.dodge -=
                    status.modificationMatrix.tryConvertResultCount(
                        T.AttackDieResult.Critical, T.AttackDieResult.Miss, modifiedInput.defense.tokens.dodge);
            }

            modifiedInput.defense.tokens.dodge -=
                status.modificationMatrix.tryConvertResultCount(
                    T.AttackDieResult.Hit, T.AttackDieResult.Miss, modifiedInput.defense.tokens.dodge);

            // block and deflect
            if ((modifiedInput.defense.block || modifiedInput.defense.deflect ||
                modifiedInput.defense.soresuMastery || modifiedInput.defense.djemSoMastery) &&
                !modifiedInput.defense.surge) {
                // spend a dodge token if we haven't already
                if (modifiedInput.defense.tokens.dodge === input.defense.tokens.dodge &&
                    modifiedInput.defense.tokens.dodge > 0) {
                    modifiedInput.defense.tokens.dodge--;
                }

                // if we spent a dodge token, gain defensive surge
                if (modifiedInput.defense.tokens.dodge < input.defense.tokens.dodge) {
                    modifiedInput.defense.surge = true;
                }
            }
        }

        // duelist (defensive)
        if (modifiedInput.defense.duelist && modifiedInput.combat.meleeAttack &&
            modifiedInput.defense.tokens.dodge < input.defense.tokens.dodge) {
            modifiedInput.defense.immunePierce = true;
        }

        // ion
        if (modifiedInput.offense.ionX.active) {
            const ionXValue = Math.min(modifiedInput.offense.ionX.value,
                (status.modificationMatrix.getResultCount(T.AttackDieResult.Critical)) + (status.modificationMatrix.getResultCount(T.AttackDieResult.Hit)));
            modifiedInput.defense.tokens.shield -= Math.min(ionXValue, modifiedInput.defense.tokens.shield);
        }

        // shield tokens
        if (modifiedInput.defense.tokens.shield > 0) {
            modifiedInput.defense.tokens.shield -=
                status.modificationMatrix.tryConvertResultCount(
                    T.AttackDieResult.Critical, T.AttackDieResult.Miss, modifiedInput.defense.tokens.shield);
            modifiedInput.defense.tokens.shield -=
                status.modificationMatrix.tryConvertResultCount(
                    T.AttackDieResult.Hit, T.AttackDieResult.Miss, modifiedInput.defense.tokens.shield);
        }
    }

    private modifyAttackDice(input: T.AttackInput, modifiedInput: T.AttackInput, status: DRT.AttackResultStatus) {
        // guardian
        if (modifiedInput.combat.guardian.active && !modifiedInput.combat.meleeAttack) {
            status.modificationMatrix.tryConvertResultCount(
                T.AttackDieResult.Hit, T.AttackDieResult.Miss, modifiedInput.combat.guardian.value);
        }

        // impact X
        if (modifiedInput.defense.armor || modifiedInput.defense.armorX.active) {
            if (modifiedInput.offense.impactX.active) {
                status.modificationMatrix.tryConvertResultCount(
                    T.AttackDieResult.Hit, T.AttackDieResult.Critical, modifiedInput.offense.impactX.value);
            }
        }

        // ram x
        if (modifiedInput.offense.ramX.active && modifiedInput.combat.meleeAttack) {
            let remainingRam = modifiedInput.offense.ramX.value;
            remainingRam -= status.modificationMatrix.tryConvertResultCount(
                T.AttackDieResult.Miss, T.AttackDieResult.Critical, remainingRam);
            status.modificationMatrix.tryConvertResultCount(
                T.AttackDieResult.Hit, T.AttackDieResult.Critical, remainingRam);
        }

        // armor
        if (modifiedInput.defense.armor) {
            status.modificationMatrix.tryConvertResultAllExcept(T.AttackDieResult.Hit, T.AttackDieResult.Miss, 0);
        }

        // armor x
        if (modifiedInput.defense.armorX.active) {
            status.modificationMatrix.tryConvertResultCount(
                T.AttackDieResult.Hit, T.AttackDieResult.Miss, modifiedInput.defense.armorX.value);
        }

        // lethal
        if (modifiedInput.offense.lethalX.active) {
            if (modifiedInput.offense.tokens.aim > 0) {
                const effectiveLethal = Math.min(modifiedInput.offense.lethalX.value, modifiedInput.offense.tokens.aim);
                modifiedInput.offense.tokens.aim -= effectiveLethal;
                modifiedInput.offense.pierceX.active = true;
                modifiedInput.offense.pierceX.value += effectiveLethal;
            }
        }
    }

    private rollDefenseDice(input: T.AttackInput, modifiedInput: T.AttackInput, status: DRT.AttackResultStatus) {
        // 1. Roll dice

        // number of defense dice to roll
        let defenseDiceCount = status.defenseResult.forcedSaves;

        // honor immune: pierce
        if (modifiedInput.defense.immunePierce) {
            modifiedInput.offense.pierceX.active = false;
        }

        // impervious
        if (modifiedInput.defense.impervious && modifiedInput.offense.pierceX.active) {
            defenseDiceCount += modifiedInput.offense.pierceX.value;
        }

        // danger sense
        if (modifiedInput.defense.dangerSenseX.active && modifiedInput.defense.tokens.suppression > 0) {
            defenseDiceCount += Math.min(
                modifiedInput.defense.dangerSenseX.value,
                modifiedInput.defense.tokens.suppression);
        }

        // roll the dice
        for (let i = 0; i < defenseDiceCount; i++) {
            const roll = this.rollDefenseDie(modifiedInput.defense.dieColor);
            if (roll === T.DefenseDieResult.Block) {
                status.defenseResult.blocks++;
            } else if (roll === T.DefenseDieResult.Surge) {
                status.defenseResult.surges++;
            } else {
                status.defenseResult.blanks++;
            }
        }

        // 2. Reroll dice
        this.rerollDefenseDice(defenseDiceCount, input, modifiedInput, status);

        status.modifiedDefenseResult.blocks = status.defenseResult.blocks;
        status.modifiedDefenseResult.surges = status.defenseResult.surges;
        status.modifiedDefenseResult.blanks = status.defenseResult.blanks;

        // 3. Convert defense surges
        this.convertDefenseSurges(input, modifiedInput, status);
    }

    private rerollDefenseDice(defenseDiceCount: number, input: T.AttackInput, modifiedInput: T.AttackInput, status: DRT.AttackResultStatus) {
        // uncanny luck
        if (modifiedInput.defense.uncannyLuckX.active) {
            let maxRerolls = defenseDiceCount - status.defenseResult.blocks;
            if (modifiedInput.defense.surge) {
                maxRerolls -= status.defenseResult.surges;
            }

            const rerolls = Math.min(maxRerolls, modifiedInput.defense.uncannyLuckX.value);

            // re-roll the dice
            for (let i = 0; i < rerolls; i++) {
                const roll = this.rollDefenseDie(modifiedInput.defense.dieColor);
                if (roll === T.DefenseDieResult.Block) {
                    status.defenseResult.blocks++;
                    status.defenseResult.blanks--;
                } else if (roll === T.DefenseDieResult.Surge) {
                    status.defenseResult.surges++;
                    status.defenseResult.blanks--;
                }
            }
        }
    }

    private convertDefenseSurges(input: T.AttackInput, modifiedInput: T.AttackInput, status: DRT.AttackResultStatus) {
        // surge -> block
        if (modifiedInput.defense.surge) {
            status.modifiedDefenseResult.blocks += status.modifiedDefenseResult.surges;
            status.modifiedDefenseResult.surges = 0;
        }

        // surge tokens
        const spentSurgeTokens = Math.min(modifiedInput.defense.tokens.surge, status.modifiedDefenseResult.surges);
        status.modifiedDefenseResult.blocks += spentSurgeTokens;
        status.modifiedDefenseResult.surges -= spentSurgeTokens;

        // no surge conversion
        status.modifiedDefenseResult.blanks += status.modifiedDefenseResult.surges;
        status.modifiedDefenseResult.surges = 0;
    }

    private modifyDefenseDice(input: T.AttackInput, modifiedInput: T.AttackInput, status: DRT.AttackResultStatus) {
        // apply pierce
        if (modifiedInput.offense.pierceX.active) {
            const effectivePierce = Math.min(status.modifiedDefenseResult.blocks, modifiedInput.offense.pierceX.value);
            status.modifiedDefenseResult.blocks -= effectivePierce;
            status.modifiedDefenseResult.blanks += effectivePierce;
        }
    }

    private compareResults(status: DRT.AttackResultStatus) {
        status.defenseResult.wounds = status.defenseResult.forcedSaves - status.modifiedDefenseResult.blocks;
    }
}
