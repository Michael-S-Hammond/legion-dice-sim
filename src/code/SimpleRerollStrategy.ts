import * as T from "./Types";
import * as RS from "./RerollStrategy";
import * as RSH from "./RerollStrategyHelpers";

import DiceModificationMatrix from "./DiceModificationMatrix";
import * as EC from './EffectiveCover';

class SimpleRerollStrategy implements RS.RerollStrategy {
    pickRerollDice(input: T.AttackInput,
                   rolls: T.AttackRoll[],
                   rerollDiceCount: number,
                   reason: RS.RerollReason,
                   remaining: RS.RemainingRerolls) : number[] | undefined {
        const dmm = new DiceModificationMatrix(rolls);
        const effectiveCover = EC.getEffectiveCover(input);
        const coverModifier = EC.getCoverModification(input, effectiveCover);
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

        // ram
        if(input.offense.ramX.active && input.combat.meleeAttack) {
            let ramRemaining = input.offense.ramX.value;
            ramRemaining -= dmm.tryConvertResultCount(T.AttackDieResult.Miss, T.AttackDieResult.Critical, ramRemaining);
            dmm.tryConvertResultCount(T.AttackDieResult.Hit, T.AttackDieResult.Critical, ramRemaining);
        }

        if(reason === RS.RerollReason.AimToken) {
            // marksman
            const critsForMarksman = dmm.getResultCount(T.AttackDieResult.Critical);
            const hitsForMarksman = dmm.getResultCount(T.AttackDieResult.Hit);
            const conversions = RSH.getMarksmanConversions(input, hitsForMarksman, critsForMarksman, remaining);

            dmm.tryConvertResultCount(T.AttackDieResult.Miss, T.AttackDieResult.Hit, conversions.blanksToHits);
            dmm.tryConvertResultCount(T.AttackDieResult.Hit, T.AttackDieResult.Critical, conversions.hitsToCrits);
        }

        // calculate dice  that can be rerolled
        rerollMiss = Math.min(rerollDiceCount, dmm.getResultCount(T.AttackDieResult.Miss));

        const totalCrits = dmm.getResultCount(T.AttackDieResult.Critical);
        const totalHits = dmm.getResultCount(T.AttackDieResult.Hit);
        
        rerollHit = 0;
        if(rerollMiss < rerollDiceCount) {
            const possibleHits = Math.min(rolls.length - totalCrits, totalHits + RSH.getMaximumRerolledDice(input, remaining));
            if(possibleHits <= coverModifier) {
                rerollHit = totalHits;
            }
        }
        rerollHit = Math.min(rerollHit, rerollDiceCount - rerollMiss);

        if(reason === RS.RerollReason.AimToken) {
            // lethal
            const effectiveHits = Math.max(0, totalHits - coverModifier);
            const effectiveLethal = RSH.getEffectiveLethal(input, effectiveHits, totalCrits);
            if(effectiveLethal > 0 && remaining.aimTokens <= effectiveLethal) {
                rerollMiss = 0;
                rerollHit = 0;
            }
        }

        // return the result
        const indexes = dmm.getRerollIndexes(rerollHit, rerollMiss);
        return indexes.length == 0 ? undefined : indexes;
    }

    shouldHandle(/*input: T.AttackInput, reason: RS.RerollReason*/) : boolean {
        return true;
    }
}

export default SimpleRerollStrategy;
