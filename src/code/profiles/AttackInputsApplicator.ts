import * as T from '../Types';
import * as UP from './UnitProfile';
import * as UC from './UpgradeCard';

type Tracking = {
    weaponCount: number,
    activeWeapons: number,
    defaultWeapon: UP.Weapon | null,
    useUnitWeaponCount: number,
    minimumRange: number,
    maximumRange?: number,
    fixedPosition: Array<UP.FixedPosition> | null,
    miniCount: number,
    offense: T.OffenseInput
}

enum SidearmAction {
    default = 1,
    ignoreUpgrade = 2
}

function getBoolean(value: boolean | null | undefined) : boolean {
    return value ? true : false;
}

function isPositionCompatible(weapon: UP.Weapon, position: Array<UP.FixedPosition> | null) : boolean {
    if(weapon.keywords?.fixed && position) {
        for(const arc of weapon.keywords.fixed) {
            if(position.includes(arc)) {
                return true;
            }
        }
        return false;
    }
    return true;
}

function getPositionOverlap(weapon: UP.Weapon, position: Array<UP.FixedPosition> | null) : Array<UP.FixedPosition> | null {
    if(weapon.keywords?.fixed && position) {
        const intersection: Array<UP.FixedPosition> = [];
        for(const arc of weapon.keywords.fixed) {
            if(position.includes(arc)) {
                intersection.push(arc);
            }
        }

        return intersection
    } else if(position) {
        return position;
    } else if(weapon.keywords?.fixed) {
        return weapon.keywords.fixed;
    }
    return null;
}

function determineSidearmAction(upgrade: UC.WeaponUpgrade, tracking: Tracking) : SidearmAction {
    let action = SidearmAction.default;
    if(upgrade.weapon) {
        switch (upgrade.weapon.keywords?.sidearm) {
            case UP.Sidearm.ranged:
                if(tracking.maximumRange === undefined || tracking.maximumRange > 0) {
                    if(!UP.isRangeCompatible(upgrade.weapon, tracking.minimumRange, tracking.maximumRange)) {
                        action = SidearmAction.ignoreUpgrade;
                    }
                }
                break;
        }
    }
    return action;
}

function isPersonnelCombatant(personnel: UC.PersonnelUpgradeCard) : boolean {
    if(personnel.keywords?.noncombatant !== undefined) {
        return !personnel.keywords?.noncombatant;
    }
    return true;
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

function applyUpgradeKeywords(upgrade: UC.Upgrade, tracking: Tracking) {
    if(upgrade.keywords) {
        if(upgrade.keywords.duelist) {
            tracking.offense.duelist = true;
        }
        if(upgrade.keywords.jediHunter) {
            tracking.offense.jediHunter = true;
        }
        if(upgrade.keywords.makashiMastery) {
            tracking.offense.makashiMastery = true;
        }
        if(upgrade.keywords.marksman) {
            tracking.offense.marksman = true;
        }
        if(upgrade.keywords.surgeHit && tracking.offense.surge === T.AttackSurgeConversion.Blank) {
            tracking.offense.surge = T.AttackSurgeConversion.Hit;
        }
        applyValueXKeyword(upgrade.keywords.precise, tracking.offense.preciseX);
        applyValueXKeyword(upgrade.keywords.sharpshooter, tracking.offense.sharpshooterX);
    }
}

function applyWeaponKeywords(keywords: UP.WeaponKeywords, multiplier: number, tracking: Tracking) {
    if(keywords.blast) {
        tracking.offense.blast = true;
    }
    applyValueXKeyword(keywords.critical, tracking.offense.criticalX, multiplier);
    if(!keywords.highVelocity) {
        tracking.offense.highVelocity = false;
    } else if(tracking.activeWeapons === 0) {
        tracking.offense.highVelocity = true;
    }
    applyValueXKeyword(keywords.impact, tracking.offense.impactX, multiplier);
    applyValueXKeyword(keywords.ion, tracking.offense.ionX, 1);
    applyValueXKeyword(keywords.lethal, tracking.offense.lethalX, multiplier);
    applyValueXKeyword(keywords.pierce, tracking.offense.pierceX, multiplier);
    applyValueXKeyword(keywords.ram, tracking.offense.ramX, multiplier);
    if(keywords.surgeCrit) {
        tracking.offense.surge = T.AttackSurgeConversion.Critical;
    }
}

function applyWeapon(weapon: UP.Weapon, multiplier: number, tracking: Tracking, incrementWeapon: boolean) {
    if(incrementWeapon && tracking.activeWeapons >= tracking.weaponCount) {
        return;
    }

    if(!isPositionCompatible(weapon, tracking.fixedPosition)) {
        return;
    }

    if(!UP.isRangeCompatible(weapon, tracking.minimumRange, tracking.maximumRange)) {
        return;
    }

    // update compatible fixed position
    tracking.fixedPosition = getPositionOverlap(weapon, tracking.fixedPosition);

    // update compatible range
    tracking.minimumRange = Math.max(weapon.minimumRange, tracking.minimumRange);
    if(tracking.maximumRange === undefined) {
        tracking.maximumRange = weapon.maximumRange;
    } else if(weapon.maximumRange !== undefined) {
        tracking.maximumRange = Math.min(weapon.maximumRange, tracking.maximumRange);
    }

    if(tracking.activeWeapons === 0) {
        tracking.offense.redDice = weapon.dice.red * multiplier;
        tracking.offense.blackDice = weapon.dice.black * multiplier;
        tracking.offense.whiteDice = weapon.dice.white * multiplier;
    } else {
        tracking.offense.redDice += weapon.dice.red * multiplier;
        tracking.offense.blackDice += weapon.dice.black * multiplier;
        tracking.offense.whiteDice += weapon.dice.white * multiplier;
    }

    if(weapon.keywords) {
        applyWeaponKeywords(weapon.keywords, multiplier, tracking);
    }

    if(incrementWeapon) {
        tracking.activeWeapons++;
    }
}

function applyWeaponUpgrade(upgrade: UC.WeaponUpgrade, multiplier: number, tracking: Tracking, incrementWeapon: boolean) {
    if(upgrade.keywords) {
        applyUpgradeKeywords(upgrade, tracking);
    }

    if(upgrade.weapon) {
        applyWeapon(upgrade.weapon, multiplier, tracking, incrementWeapon);
    }
}

function applyHeavyWeaponUpgrade(upgrade: UC.HeavyWeaponUpgrade, tracking: Tracking) {
    if(upgrade.weapon) {
        const action = determineSidearmAction(upgrade, tracking);

        if(action === SidearmAction.default) {
            if(UP.isRangeCompatible(upgrade.weapon, tracking.minimumRange, tracking.maximumRange)) {
                applyWeaponUpgrade(upgrade, 1, tracking, false);
            } else if(tracking.defaultWeapon) {
                applyWeapon(tracking.defaultWeapon, 1, tracking, false);
            }
        }
    } else if(tracking.defaultWeapon) {
        applyWeapon(tracking.defaultWeapon, 1, tracking, false);
    }
}

function applyPersonnelUpgrade(upgrade: UC.PersonnelUpgradeCard, tracking: Tracking) {
    if(isPersonnelCombatant(upgrade)) {
        if(upgrade.weapon) {
            const action = determineSidearmAction(upgrade, tracking);

            if(action === SidearmAction.default) {
                if(UP.isRangeCompatible(upgrade.weapon, tracking.minimumRange, tracking.maximumRange)) {
                    applyWeaponUpgrade(upgrade, 1, tracking, false);
                } else if(tracking.defaultWeapon) {
                    applyWeapon(tracking.defaultWeapon, 1, tracking, false);
                }
            }
        } else if(tracking.defaultWeapon) {
            applyWeapon(tracking.defaultWeapon, 1, tracking, false);
        }
    } else {
        applyUpgradeKeywords(upgrade, tracking);
    }
}

function applyUpgrade(tracking: Tracking, upgrade: UC.Upgrade) : void {
    switch(upgrade.type) {
        case UP.UnitUpgrade.armament:
            applyWeaponUpgrade(upgrade as UC.WeaponUpgrade, tracking.miniCount, tracking, true);
            break;
        case UP.UnitUpgrade.command:
            applyUpgradeKeywords(upgrade, tracking);
            break;
        case UP.UnitUpgrade.comms:
            applyUpgradeKeywords(upgrade, tracking);
            break;
        case UP.UnitUpgrade.counterpart:
            applyWeaponUpgrade(upgrade as UC.WeaponUpgrade, (upgrade as UC.CounterpartUpgrade).miniCount, tracking, false);
            break;
        case UP.UnitUpgrade.crew:
            applyWeaponUpgrade(upgrade as UC.CrewUpgrade, 1, tracking, true);
            break;
        case UP.UnitUpgrade.force:
            applyUpgradeKeywords(upgrade, tracking);
            break;
        case UP.UnitUpgrade.gear:
            applyUpgradeKeywords(upgrade, tracking);
            break;
        case UP.UnitUpgrade.generator:
            if(tracking.fixedPosition && tracking.fixedPosition.length > 0) {
                const generator = upgrade as UC.GeneratorUpgrade;
                tracking.offense.redDice += generator.dice.red;
                tracking.offense.blackDice += generator.dice.black;
                tracking.offense.whiteDice += generator.dice.white;
                applyWeaponKeywords(generator.weaponKeywords, tracking.miniCount, tracking);
            }
            break;
        case UP.UnitUpgrade.grenades:
            applyWeaponUpgrade(upgrade as UC.WeaponUpgrade, tracking.miniCount, tracking, true);
            break;
        case UP.UnitUpgrade.hardpoint:
            applyWeaponUpgrade(upgrade as UC.WeaponUpgrade, tracking.miniCount, tracking, true);
            break;
        case UP.UnitUpgrade.heavyWeapon:
            applyHeavyWeaponUpgrade(upgrade as UC.HeavyWeaponUpgrade, tracking);
            break;
        case UP.UnitUpgrade.ordinance:
            applyWeaponUpgrade(upgrade as UC.WeaponUpgrade, tracking.miniCount, tracking, true);
            break;
        case UP.UnitUpgrade.personnel:
            applyPersonnelUpgrade(upgrade as UC.PersonnelUpgradeCard, tracking);
            break;
        case UP.UnitUpgrade.pilot:
            applyUpgradeKeywords(upgrade, tracking);
            break;
        case UP.UnitUpgrade.training:
            applyUpgradeKeywords(upgrade, tracking);
            break;
    }
}

function applySpecialUpgrades(upgrades: Array<UC.Upgrade>, tracking: Tracking) {
    if(upgrades.filter(u => u.type === UP.UnitUpgrade.force && u.name === "Saber Throw").length > 0) {
        if(tracking.activeWeapons === 1 && tracking.maximumRange === 0) {
            const totalDice = tracking.offense.redDice + tracking.offense.blackDice + tracking.offense.whiteDice;
            const halfDice = Math.floor((totalDice + 1) / 2);
            tracking.offense.redDice = Math.min(tracking.offense.redDice, halfDice);
            tracking.offense.blackDice = Math.min(tracking.offense.blackDice, halfDice - tracking.offense.redDice);
            tracking.offense.whiteDice = Math.min(tracking.offense.whiteDice, halfDice - tracking.offense.redDice - tracking.offense.blackDice);
            tracking.minimumRange = 1;
            tracking.maximumRange = 2;
        }
    }
}

function createTrackingObject(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>, tokens: T.OffenseTokens) : Tracking {
    let totalWeapons = weapons.length;
    let arsenal = 0;
    if(profile.keywords?.arsenal) {
        arsenal = profile.keywords.arsenal;
    }
    upgrades.forEach(u => {
        if(u.keywords?.arsenal) {
            arsenal += u.keywords.arsenal;
        }

        if(u.type === UP.UnitUpgrade.armament ||
                u.type === UP.UnitUpgrade.grenades ||
                u.type === UP.UnitUpgrade.hardpoint ||
                u.type === UP.UnitUpgrade.ordinance) {
            const weaponUpgrade = <UC.WeaponUpgrade>u;
            if(weaponUpgrade.weapon) {
                totalWeapons++;
            }
        }
    });

    if(arsenal === 0) {
        arsenal = 1;
    }

    return {
        weaponCount: arsenal,
        activeWeapons: 0,
        defaultWeapon: null,
        useUnitWeaponCount: Math.min(Math.max(0, arsenal - (totalWeapons - weapons.length)), weapons.length),
        minimumRange: 0,
        fixedPosition: null,
        miniCount: profile.miniCount,
        offense: {
            redDice: 0,
            blackDice: 0,
            whiteDice: 0,
            surge: UP.convertUnitProfileSurgeToAttackSurge(profile.attackSurge),
            tokens: tokens,
            blast: false,
            criticalX: { active: false, value: 1},
            duelist: getBoolean(profile.keywords?.duelist),
            highVelocity: false,
            impactX: { active: false, value: 1},
            ionX: { active: false, value: 1},
            jediHunter: getBoolean(profile.keywords?.jediHunter),
            lethalX: { active: false, value: 1},
            makashiMastery: getBoolean(profile.keywords?.makashiMastery),
            marksman: getBoolean(profile.keywords?.marksman),
            pierceX: { active: false, value: 1},
            preciseX: profile.keywords?.precise ? { active: true, value: profile.keywords.precise } : { active: false, value: 1},
            ramX: { active: false, value: 1},
            sharpshooterX: { active: false, value: 1}
        }
    }
}

export function createAttackInputsFromProfile(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>, tokens: T.OffenseTokens) : T.AttackInput {
    const tracking = createTrackingObject(profile, weapons, upgrades, tokens);

    let usedUnitWeapons = 0;
    weapons.forEach(w => {
        if(usedUnitWeapons < tracking.useUnitWeaponCount &&
                UP.isRangeCompatible(w, tracking.minimumRange, tracking.maximumRange)) {
            applyWeapon(w, tracking.miniCount, tracking, true);
            if(!tracking.defaultWeapon) {
                tracking.defaultWeapon = w;
            }
            usedUnitWeapons++;
        }
    });

    upgrades.forEach(u => {
        if(u.type !== UP.UnitUpgrade.generator) {
            applyUpgrade(tracking, u);
        }
    });

    applySpecialUpgrades(upgrades, tracking);

    // apply generators last because they depend on which weapons are used
    upgrades.forEach(u => {
        if(u.type === UP.UnitUpgrade.generator) {
            applyUpgrade(tracking, u);
        }
    });

    const input = T.createDefaultAttackInput();
    input.offense = tracking.offense;
    input.combat.meleeAttack = tracking?.maximumRange !== undefined ? tracking?.maximumRange === 0 : false;

    return input;
}
