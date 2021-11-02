import * as T from "./Types";
import * as DRT from './DiceRollerTypes';
import * as EC from "./EffectiveCover";
import * as RS from "./RerollStrategy";

export function getEffectiveLethal(input: T.AttackInput, effectiveHits: number, criticals: number) : number {
    const immunePierce = input.defense.immunePierce ||
        ((input.defense.duelist || input.defense.immuneMeleePierce) && input.combat.meleeAttack);
    let effectiveLethal = 0;
    if(input.offense.lethalX.active && !immunePierce) {
        let effectiveDamage = input.defense.outmaneuver ?
            Math.max(0, (criticals + effectiveHits) - input.defense.tokens.dodge) :
            criticals + Math.max(0, effectiveHits - input.defense.tokens.dodge);
        effectiveDamage = Math.max(0, effectiveDamage - input.defense.tokens.shield);
        let pierceValue = input.offense.pierceX.active ? input.offense.pierceX.value : 0;
        if(input.offense.duelist && input.combat.meleeAttack) {
            pierceValue++;
        }
        const damageAfterPierce = Math.max(effectiveDamage - pierceValue, 0);
        effectiveLethal = Math.min(damageAfterPierce, input.offense.lethalX.value);
    }
    return effectiveLethal;
}

export type Conversions = {
    hitsToCrits: number,
    blanksToHits: number
}

export function getMarksmanConversions(input: T.AttackInput, hits: number, crits: number, rerolls: RS.RemainingRerolls) : Conversions {
    const conversions = {
        hitsToCrits: 0,
        blanksToHits: 0
    };

    if(rerolls.aimTokens === 0 || !input.offense.marksman) {
        return conversions;
    }

    let aimTokens = rerolls.aimTokens;

    const totalDice = input.offense.redDice + input.offense.blackDice + input.offense.whiteDice;
    const cover = EC.getCoverModification(input, EC.getEffectiveCover(input));
    const maxCancelledHits =
        cover +
        (input.combat.guardian.active ? input.combat.guardian.value : 0);

    let effectiveLethal = getEffectiveLethal(input, hits, crits);
    while(aimTokens > effectiveLethal) {
        let lostHits = 0;
        let workingHits = hits + conversions.blanksToHits - conversions.hitsToCrits;
        let workingCrits = crits + conversions.hitsToCrits;
        const startingMiss = totalDice - (workingHits + workingCrits);
        let workingMiss = startingMiss;

        let guardian = 0;
        if(input.combat.guardian.active) {
            guardian = Math.min(workingHits, input.combat.guardian.value);
            workingMiss += guardian;
            workingHits -= guardian;
            lostHits += guardian;
        }

        const effectiveCover = Math.min(cover, workingHits);
        workingHits -= effectiveCover;
        workingMiss += effectiveCover;
        lostHits += effectiveCover;

        let remainingImpact = 0;
        let impact = 0;
        if(input.offense.impactX.active && (input.defense.armor || input.defense.armorX.active)) {
            impact = input.offense.impactX.value;
            const workingImpact = Math.min(workingHits, input.offense.impactX.value);
            workingCrits += workingImpact;
            workingHits -= workingImpact;
            remainingImpact = input.offense.impactX.value - workingImpact;
        }

        if(input.offense.ramX.active) {
            let change = Math.min(input.offense.ramX.value, workingMiss);
            workingMiss -= change;
            workingCrits += change;
    
            change = Math.min(input.offense.ramX.value - change, workingHits);
            workingHits -= change;
            workingCrits += change;
        }

        effectiveLethal = getEffectiveLethal(input, workingHits, workingCrits);

        const availableAims = aimTokens - effectiveLethal;
        const convertHits = Math.max(0, Math.min(
            availableAims, totalDice - (conversions.blanksToHits + conversions.hitsToCrits)));
        const pre = {
            blanksToHits: conversions.blanksToHits,
            hitsToCrits: conversions.hitsToCrits
        };

        if(availableAims > 0) {
            if(input.defense.armor) {
                if(workingHits > 0) {
                    conversions.hitsToCrits++;
                    aimTokens--;
                } else if(lostHits >= workingHits && lostHits > 0) {
                    conversions.hitsToCrits++;
                    aimTokens--;
                } else if(availableAims > 1) {
                    conversions.blanksToHits++;
                    conversions.hitsToCrits++;
                    aimTokens -= 2;
                }
                else {
                    break;
                }
            } else if(input.defense.armorX.active) {
                if((totalDice - workingCrits - Math.max(workingHits - input.defense.armorX.value, 0) === maxCancelledHits) &&
                        (Math.min(lostHits, aimTokens) < impact)) {
                    break;
                }
                if(lostHits === maxCancelledHits && (remainingImpact > 0 || workingHits >= input.defense.armorX.value) && startingMiss > 0) {
                    conversions.blanksToHits++;
                    aimTokens--;
                } else if(lostHits > 0 ) {
                    conversions.hitsToCrits++;
                    aimTokens--;
                } else if(aimTokens >= 2 && (totalDice - (hits + crits) - conversions.hitsToCrits > 0)) {
                    conversions.blanksToHits++;
                    conversions.hitsToCrits++;
                    aimTokens -= 2;
                }
            } else {
                if(maxCancelledHits > 0 && aimTokens >= 2 && convertHits <= maxCancelledHits + 1) {
                    conversions.blanksToHits++;
                    conversions.hitsToCrits++;
                    aimTokens -= 2;
                } else if(convertHits > maxCancelledHits) {
                    conversions.blanksToHits += convertHits;
                    aimTokens -= convertHits;
                } else if(lostHits > 0 ) {
                    conversions.hitsToCrits++;
                    aimTokens--;
                } else if(aimTokens >= 2 && (totalDice - (hits + crits) - conversions.hitsToCrits > 0)) {
                    conversions.blanksToHits++;
                    conversions.hitsToCrits++;
                    aimTokens -= 2;
                }
            }
        }

        conversions.blanksToHits = Math.min(conversions.blanksToHits, totalDice - (hits + crits));
        conversions.hitsToCrits = Math.min(conversions.hitsToCrits, totalDice - crits);

        if(pre.blanksToHits === conversions.blanksToHits && pre.hitsToCrits === conversions.hitsToCrits) {
            break;
        }
    }

    return conversions;
}

export function convertMarksman(input: T.AttackInput, status: DRT.AttackResultStatus, rerolls: RS.RemainingRerolls) : void {
    const hits = status.modificationMatrix.getResultCount(T.AttackDieResult.Hit);
    const crits = status.modificationMatrix.getResultCount(T.AttackDieResult.Critical);
    const conversions = getMarksmanConversions(input, hits, crits, rerolls);
    status.modificationMatrix.tryConvertResultCount(T.AttackDieResult.Miss, T.AttackDieResult.Hit, conversions.blanksToHits);
    status.modificationMatrix.tryConvertResultCount(T.AttackDieResult.Hit, T.AttackDieResult.Critical, conversions.hitsToCrits);
}

export function getMaximumRerolledDice(input: T.AttackInput, rerolls: RS.RemainingRerolls) : number {
    return rerolls.observationTokens +
            (rerolls.aimTokens * (2 + (input.offense.preciseX.active ? input.offense.preciseX.value : 0)));
}
