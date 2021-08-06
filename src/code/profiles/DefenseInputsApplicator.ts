import * as T from '../Types';
import * as UP from './UnitProfile';
import * as UC from './UpgradeCard';

type Tracking = {
    defense: T.DefenseInput
}

function getBoolean(value: boolean | null | undefined) : boolean {
    return value ? true : false;
}

function getValueX(value: number | null | undefined) : T.AbilityX {
    if(value !== null && value !== undefined) {
        if(value > 0) {
            return { active: true, value: value }
        }
    }
    return { active: false, value: 1};
}

function applyValueXKeyword(value: number | undefined, keyword: T.AbilityX, unitCount = 1) {
    if(value !== undefined) {
        if(keyword.active) {
            keyword.value += (value * unitCount);
        } else {
            keyword.active = true;
            keyword.value = (value * unitCount);
        }
    }
}

function applyUpgrade(upgrade: UC.Upgrade, tracking: Tracking) {
    if(upgrade.keywords) {
        if(upgrade.keywords.armor) {
            tracking.defense.armor = true;
        }
        applyValueXKeyword(upgrade.keywords.armorX, tracking.defense.armorX);
        if(upgrade.keywords.block) {
            tracking.defense.block = true;
        }

        if(upgrade.keywords.cover === T.Cover.Heavy) {
            tracking.defense.cover = T.Cover.Heavy;
        } else if(upgrade.keywords.cover === T.Cover.Light) {
            tracking.defense.cover = (tracking.defense.cover === T.Cover.None) ? T.Cover.Light : T.Cover.Heavy;
        }

        applyValueXKeyword(upgrade.keywords.dangerSense, tracking.defense.dangerSenseX);
        if(upgrade.keywords.deflect) {
            tracking.defense.deflect = true;
        }
        if(upgrade.keywords.djemSoMastery) {
            tracking.defense.djemSoMastery = true;
        }
        if(upgrade.keywords.duelist) {
            tracking.defense.duelist = true;
        }

        if(upgrade.keywords.immune) {
            upgrade.keywords.immune.forEach(i => {
                switch(i) {
                    case UP.UnitImmune.blast:
                        tracking.defense.immuneBlast = true;
                        break;
                    case UP.UnitImmune.meleePierce:
                        tracking.defense.immuneMeleePierce = true;
                        break;
                    case UP.UnitImmune.pierce:
                        tracking.defense.immunePierce = true;
                        break;
                }
            });
        }

        if(upgrade.keywords.impervious) {
            tracking.defense.impervious = true;
        }
        if(upgrade.keywords.lowProfile) {
            tracking.defense.lowProfile = true;
        }
        if(upgrade.keywords.outmaneuver) {
            tracking.defense.outmaneuver = true;
        }
        if(upgrade.keywords.shielded) {
            tracking.defense.tokens.shield += upgrade.keywords.shielded;
        }
        if(upgrade.keywords.soresuMastery) {
            tracking.defense.soresuMastery = true;
        }
        applyValueXKeyword(upgrade.keywords.uncannyLuck, tracking.defense.uncannyLuckX);
    }
}

function applySpecialUpgrades(upgrades: Array<UC.Upgrade>, tracking: Tracking) {
    if(upgrades.filter(u => u.type === UP.UnitUpgrade.training && u.name === "Duck and Cover").length > 0) {
        if(tracking.defense.cover === T.Cover.None) {
            tracking.defense.cover = T.Cover.Light;
        }
    }
}

function createTrackingObject(profile: UP.UnitProfile, upgrades: Array<UC.Upgrade>, tokens: T.DefenseTokens) : Tracking {
    return {
        defense: {
            armor: getBoolean(profile.keywords?.armor),
            armorX: getValueX(profile.keywords?.armorX),
            block: getBoolean(profile.keywords?.block),
            cover: (profile.keywords?.cover) ? profile.keywords.cover : T.Cover.None,
            dangerSenseX: getValueX(profile.keywords?.dangerSense),
            deflect: getBoolean(profile.keywords?.deflect),
            dieColor: profile.defenseDie,
            djemSoMastery: getBoolean(profile.keywords?.djemSoMastery),
            duelist: getBoolean(profile.keywords?.duelist),
            hasForceUpgrades: (profile.upgrades || []).filter(u => u === UP.UnitUpgrade.force).length > 0,
            immuneBlast: (profile.keywords?.immune || []).filter(i => i === UP.UnitImmune.blast).length > 0,
            immuneMeleePierce: (profile.keywords?.immune || []).filter(i => i === UP.UnitImmune.meleePierce).length > 0,
            immunePierce: (profile.keywords?.immune || []).filter(i => i === UP.UnitImmune.pierce).length > 0,
            impervious: getBoolean(profile.keywords?.impervious),
            lowProfile: getBoolean(profile.keywords?.lowProfile),
            outmaneuver: getBoolean(profile.keywords?.outmaneuver),
            soresuMastery: getBoolean(profile.keywords?.soresuMastery),
            surge: profile.defenseSurge,
            tokens: {
                dodge: tokens.dodge,
                observation: tokens.observation,
                shield: profile.keywords?.shielded ? tokens.shield + profile.keywords.shielded : tokens.shield,
                suppression: tokens.suppression,
                surge: tokens.surge
            },
            uncannyLuckX: getValueX(profile.keywords?.uncannyLuck)
        }
    }
}

export function createDefenseInputsFromProfile(profile: UP.UnitProfile, upgrades: Array<UC.Upgrade>, tokens: T.DefenseTokens) : T.AttackInput {
    const tracking = createTrackingObject(profile, upgrades, tokens);

    upgrades.forEach(u => {
        applyUpgrade(u, tracking);
    });

    applySpecialUpgrades(upgrades, tracking);

    const input = T.createDefaultAttackInput();
    input.defense = tracking.defense;

    return input;
}
