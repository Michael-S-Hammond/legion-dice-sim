import * as T from "./Types";
import * as RS from "./RerollStrategy";
import * as RSH from "./RerollStrategyHelpers";

import DiceModificationMatrix, * as DMM from "./DiceModificationMatrix";
import * as EC from './EffectiveCover';

class ArmorRerollStrategy implements RS.RerollStrategy {
    pickRerollDice(input: T.AttackInput,
                   rolls: T.AttackRoll[],
                   rerollDiceCount: number,
                   reason: RS.RerollReason,
                   remaining: RS.RemainingRerolls) : number[] | undefined {
        const dmm = new DiceModificationMatrix(rolls);
        const effectiveCover = EC.getEffectiveCover(input);
        const coverModifier = EC.getCoverModification(effectiveCover);
        let rerollMiss = 0;

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

        // ram
        if(input.offense.ramX.active && input.combat.meleeAttack) {
            let ramRemaining = input.offense.ramX.value;
            ramRemaining -= dmm.tryConvertResultCount(T.AttackDieResult.Miss, T.AttackDieResult.Critical, ramRemaining);
            dmm.tryConvertResultCount(T.AttackDieResult.Hit, T.AttackDieResult.Critical, ramRemaining);
        }

        // any hits to be rerolled should be converted to misses in this block
        // therefore, hits should always be 0 when this completes

        const totalHits = dmm.getResultCount(T.AttackDieResult.Hit);
        let totalCrits = dmm.getResultCount(T.AttackDieResult.Critical);
        const possibleHits = Math.min(rolls.length - totalCrits, totalHits + RSH.getMaximumRerolledDice(input, remaining));
        let hitsToKeep = 0;
        if(input.offense.impactX.active && (possibleHits > coverModifier)) {
            hitsToKeep = Math.min(totalHits, coverModifier + input.offense.impactX.value);
        }

        // remove hits for cover and armor, less impact
        dmm.tryConvertResultAllExcept(T.AttackDieResult.Hit, T.AttackDieResult.Miss, hitsToKeep);

        // calculate misses that can be rerolled
        rerollMiss = Math.min(rerollDiceCount, dmm.getResultCount(T.AttackDieResult.Miss));

        if(reason === RS.RerollReason.AimToken) {
            // convert hits to crit for impact
            const impactConvert = Math.max(0, dmm.getResultCount(T.AttackDieResult.Hit) - coverModifier);
            dmm.tryConvertResultCount(T.AttackDieResult.Hit, T.AttackDieResult.Critical, impactConvert);

            // lethal
            totalCrits = dmm.getResultCount(T.AttackDieResult.Critical);
            const effectiveLethal = RSH.getEffectiveLethal(input, 0, totalCrits, 0);
            if(effectiveLethal > 0 && remaining.aimTokens <= effectiveLethal) {
                rerollMiss = 0;
            }
        }

        // return the result
        const indexes = dmm.getRerollIndexes(0, rerollMiss);
        return indexes.length == 0 ? undefined : indexes;
    }

    shouldHandle(input: T.AttackInput, reason: RS.RerollReason) : boolean {
        return input.defense.armor;
    }
}

export default ArmorRerollStrategy;
