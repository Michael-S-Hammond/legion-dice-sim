import * as T from './Types';

export function getCoverModification(cover: T.Cover) : number {
    return (cover === T.Cover.Heavy) ? 2 :
        (cover === T.Cover.Light) ? 1 :
        0;
}

export function getEffectiveCover(input: T.AttackInput) : T.Cover {
    // cover only applies to ranged attacks
    if(input.combat.meleeAttack) {
        return T.Cover.None;
    }

    // effective cover with modifications
    let effectiveCover = input.defense.cover;

    // cover from surpression
    if(input.defense.tokens.suppression > 0) {
        if(effectiveCover == T.Cover.None) {
            effectiveCover = T.Cover.Light;
        } else if(effectiveCover == T.Cover.Light) {
            effectiveCover = T.Cover.Heavy;
        }
    }

    // low profile
    if(input.defense.lowProfile && effectiveCover === T.Cover.Light) {
        effectiveCover = T.Cover.Heavy;
    }

    // sharpshooter X
    if(input.offense.sharpshooterX.active && effectiveCover !== T.Cover.None) {
        if(input.offense.sharpshooterX.value == 1) {
            if(effectiveCover === T.Cover.Heavy) {
                effectiveCover = T.Cover.Light;
            } else {
                effectiveCover = T.Cover.None;
            }
        } else if(input.offense.sharpshooterX.value == 2) {
            effectiveCover = T.Cover.None;
        }
    }

    // blast & immune: blast
    if(input.offense.blast && !input.defense.immuneBlast) {
        effectiveCover = T.Cover.None;
    }

    return effectiveCover;
}
