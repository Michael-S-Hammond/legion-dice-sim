import * as T from "./Types";
import * as RS from "./RerollStrategy";
import * as RSH from "./RerollStrategyHelpers";

import DiceModificationMatrix from "./DiceModificationMatrix";
import * as EC from './EffectiveCover';

class ArmorXRerollStrategy implements RS.RerollStrategy {
    pickRerollDice(input: T.AttackInput,
                   rolls: T.AttackRoll[],
                   rerollDiceCount: number,
                   reason: RS.RerollReason,
                   remaining: RS.RemainingRerolls) : number[] | undefined {
        const dmm = new DiceModificationMatrix(rolls);
        const effectiveCover = EC.getEffectiveCover(input);
        const coverModifier = EC.getCoverModification(effectiveCover);
        let rerollMiss = 0;
        let rerollHit = 0;

        // convert surges
        if(input.offense.surge === T.AttackSurgeConversion.Critical) {
            dmm.tryConvertResultCount(T.AttackDieResult.Surge, T.AttackDieResult.Critical, rolls.length);
        }
        if(input.offense.criticalX.active) {
            dmm.tryConvertResultCount(T.AttackDieResult.Surge, T.AttackDieResult.Critical, input.offense.criticalX.value);
        }
        if(input.offense.surge === T.AttackSurgeConversion.Hit) {
            dmm.tryConvertResultCount(T.AttackDieResult.Surge, T.AttackDieResult.Hit, rolls.length);
        }
        dmm.tryConvertResultCount(T.AttackDieResult.Surge, T.AttackDieResult.Miss, rolls.length);

        rerollMiss = Math.min(rerollDiceCount, dmm.getResultCount(T.AttackDieResult.Miss));
        const startingHits = dmm.getResultCount(T.AttackDieResult.Hit);
        const totalCrits = dmm.getResultCount(T.AttackDieResult.Critical);
        const possibleHits = Math.min(rolls.length - totalCrits, startingHits + RSH.getMaximumRerolledDice(input, remaining));
        const hitsCancelledByCover = Math.min(startingHits, coverModifier);
        const hitsAfterCover = startingHits - hitsCancelledByCover;

        // convert for impact
        let effectiveImpact = 0;
        let remainingImpact = 0;
        let hitsAfterImpact = hitsAfterCover;
        if(input.offense.impactX.active) {
            effectiveImpact = Math.min(hitsAfterCover, input.offense.impactX.value);
            remainingImpact = input.offense.impactX.value - effectiveImpact;
            hitsAfterImpact = hitsAfterCover - effectiveImpact;
        }

        // convert for ram x
        let hitsAfterRam = hitsAfterImpact;
        let ramConvertMiss = 0;
        let ramConvertHit = 0;
        if(input.offense.ramX.active && input.combat.meleeAttack) {
            let remainingRam = input.offense.ramX.value;
            ramConvertMiss = Math.min(remainingRam, rerollMiss);
            rerollMiss -= ramConvertMiss;
            remainingRam -= ramConvertMiss;
            ramConvertHit = Math.min(remainingRam, hitsAfterImpact);
            hitsAfterRam -= ramConvertHit;
        }
        const effectiveRam = ramConvertMiss + ramConvertHit;

        // convert for armor x
        const remainingArmor = Math.max(0, input.defense.armorX.value - hitsAfterRam);
        const effectiveArmor = input.defense.armorX.value - remainingArmor;
        const hitsAfterArmor = hitsAfterRam - effectiveArmor;

        // determine effect of lethal
        let lethalOverride = false;
        if(reason === RS.RerollReason.AimToken) {
            const effectiveLethal = RSH.getEffectiveLethal(input, hitsAfterArmor, totalCrits + effectiveImpact, 0);
            if(effectiveLethal > 0 && remaining.aimTokens <= effectiveLethal) {
                lethalOverride = true;
            }
        }

        // it may be possible in some of the cases that rerollHit + rerollMiss > rerollDiceCount
        if(lethalOverride) {
            rerollMiss = 0;
            rerollHit = 0;
        } else if(rerollMiss === rerollDiceCount) {
            rerollHit = 0;
        } else if(possibleHits <= coverModifier) {
            rerollHit = rerollDiceCount - rerollMiss - effectiveRam;
        } else if(!input.offense.impactX.active && possibleHits <= coverModifier + input.defense.armorX.value) {
            rerollHit = rerollDiceCount - rerollMiss - effectiveRam;
        } else if(input.offense.impactX.active && possibleHits <= coverModifier + input.offense.impactX.value) {
            rerollHit = 0;
        } else if(input.offense.impactX.active && possibleHits <= coverModifier + input.offense.impactX.value + input.defense.armorX.value) {
            rerollHit = possibleHits - (coverModifier + input.offense.impactX.value) - effectiveRam;
        } else { // enough dice to get past the armor and hits to count as damage
            rerollHit = 0;
        }

        // fix possibility of rolling invalid number of dice
        if(rerollHit < 0) {
            rerollHit = 0;
        }
        if(rerollHit + rerollMiss > rerollDiceCount) {
            rerollHit = rerollDiceCount - rerollMiss;
        }

        // return the result
        const indexes = dmm.getRerollIndexes(rerollHit, rerollMiss);
        return indexes.length == 0 ? undefined : indexes;
    }

    shouldHandle(input: T.AttackInput, reason: RS.RerollReason) : boolean {
        return input.defense.armorX.active;
    }
}

export default ArmorXRerollStrategy;
