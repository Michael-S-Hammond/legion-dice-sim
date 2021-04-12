import * as T from "./Types";
import * as RS from "./RerollStrategy";

export function getEffectiveLethal(input: T.AttackInput, effectiveHits: number, criticals: number, coverModifier: number) : number {
    const immunePierce = input.defense.immunePierce ||
        (input.defense.duelist && input.combat.meleeAttack);
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
        return Math.min(damageAfterPierce, input.offense.lethalX.value);
    }
    return 0;
}

export function getMaximumRerolledDice(input: T.AttackInput, rerolls: RS.RemainingRerolls) : number {
    return rerolls.observationTokens +
            (rerolls.aimTokens * (2 + (input.offense.preciseX.active ? input.offense.preciseX.value : 0)));
}
