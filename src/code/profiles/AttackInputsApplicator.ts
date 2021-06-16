import * as T from '../Types';
import * as UP from './UnitProfile';
import * as UC from './UpgradeCard';

type Tracking = {
    weaponCount: number,
    activeWeapons: number,
    defaultWeapon: UP.Weapon | null,
    useBaseWeapon: boolean,
    minimumRange: number,
    maximumRange?: number,
    fixedPosition: Array<UP.FixedPosition> | null,
    miniCount: number,
    offense: T.OffenseInput
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

function isRangeCompatible(weapon: UP.Weapon, minimumRange: number, maximumRange?: number) : boolean {
    // both have melee
    if(weapon.minimumRange === 0 && minimumRange === 0) {
        return true;
    }

    // both have infinite range
    if(weapon.maximumRange === undefined && maximumRange === undefined) {
        return true;
    }

    // one has infinite range
    if(maximumRange === undefined) {
        return weapon.maximumRange !== undefined && weapon.maximumRange >= minimumRange;
    }

    if(weapon.maximumRange === undefined) {
        return maximumRange >= weapon.minimumRange;
    }

    // test ranges for overlap
    return (weapon.maximumRange >= minimumRange && weapon.maximumRange <= maximumRange) ||
        (weapon.minimumRange >= minimumRange && weapon.minimumRange <= maximumRange) ||
        (maximumRange >= weapon.minimumRange && maximumRange <= weapon.maximumRange) ||
        (minimumRange >= weapon.minimumRange && minimumRange <= weapon.maximumRange);
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
        applyValueXKeyword(upgrade.keywords.precise, tracking.offense.preciseX);
        applyValueXKeyword(upgrade.keywords.sharpshooter, tracking.offense.sharpshooterX);
    }
}

function applyWeapon(weapon: UP.Weapon, multiplier: number, tracking: Tracking) {
    if(tracking.activeWeapons >= tracking.weaponCount) {
        return;
    }

    if(!isPositionCompatible(weapon, tracking.fixedPosition)) {
        return;
    }

    if(!isRangeCompatible(weapon, tracking.minimumRange, tracking.maximumRange)) {
        return;
    }

    // update compatible fixed position
    tracking.fixedPosition = getPositionOverlap(weapon, tracking.fixedPosition);

    // update compatible range
    tracking.minimumRange = Math.max(weapon.minimumRange, tracking.minimumRange);
    if(!tracking.maximumRange) {
        tracking.maximumRange = weapon.maximumRange;
    } else if(weapon.maximumRange) {
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
        if(weapon.keywords.blast) {
            tracking.offense.blast = true;
        }
        applyValueXKeyword(weapon.keywords.critical, tracking.offense.criticalX, multiplier);
        if(!weapon.keywords.highVelocity) {
            tracking.offense.highVelocity = false;
        } else if(tracking.activeWeapons === 0) {
            tracking.offense.highVelocity = true;
        }
        applyValueXKeyword(weapon.keywords.impact, tracking.offense.impactX, multiplier);
        applyValueXKeyword(weapon.keywords.ion, tracking.offense.ionX, 1);
        applyValueXKeyword(weapon.keywords.lethal, tracking.offense.lethalX, multiplier);
        applyValueXKeyword(weapon.keywords.pierce, tracking.offense.pierceX, multiplier);
        applyValueXKeyword(weapon.keywords.ram, tracking.offense.ramX, multiplier);
        if(weapon.keywords.surgeCrit) {
            tracking.offense.surge = T.AttackSurgeConversion.Critical;
        }
    }

    tracking.activeWeapons++;
}

function applyWeaponUpgrade(upgrade: UC.WeaponUpgrade, multiplier: number, tracking: Tracking) {
    if(upgrade.keywords) {
        applyUpgradeKeywords(upgrade, tracking);
    }
    if(upgrade.weapon !== undefined) {
        if(upgrade.weapon) {
            applyWeapon(upgrade.weapon, multiplier, tracking);
        }
    }
}

function applyUpgrades(tracking: Tracking, upgrade: UC.Upgrade) : void {
    switch(upgrade.type) {
        case UP.UnitUpgrade.armament:
            applyWeaponUpgrade(upgrade as UC.WeaponUpgrade, tracking.miniCount, tracking);
            break;
        case UP.UnitUpgrade.grenades:
            applyWeaponUpgrade(upgrade as UC.WeaponUpgrade, tracking.miniCount, tracking);
            break;
        case UP.UnitUpgrade.hardpoint:
            applyWeaponUpgrade(upgrade as UC.WeaponUpgrade, tracking.miniCount, tracking);
            break;
        case UP.UnitUpgrade.heavyWeapon:
            applyWeaponUpgrade(upgrade as UC.WeaponUpgrade, 1, tracking);
            break;
    }
}

function createTrackingObject(profile: UP.UnitProfile, weapon: UP.Weapon | null, upgrades: Array<UC.Upgrade>, tokens: T.OffenseTokens) : Tracking {
    let totalWeapons = weapon ? 1 : 0;
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
                u.type === UP.UnitUpgrade.hardpoint) {
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
        useBaseWeapon: totalWeapons <= arsenal,
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
            pierceX: { active: false, value: 1},
            preciseX: { active: false, value: 1},
            ramX: { active: false, value: 1},
            sharpshooterX: { active: false, value: 1}
        }
    }
}

export function createAttackInputsFromProfile(profile: UP.UnitProfile, weapon: UP.Weapon | null, upgrades: Array<UC.Upgrade>, tokens: T.OffenseTokens) : T.AttackInput {
    const tracking = createTrackingObject(profile, weapon, upgrades, tokens);

    if(tracking.useBaseWeapon && weapon) {
        applyWeapon(weapon, tracking.miniCount, tracking);
        tracking.defaultWeapon = weapon;
    }

    upgrades.forEach(u => {
        applyUpgrades(tracking, u);
    });

    const input = T.createDefaultAttackInput();
    input.offense = tracking.offense;
    input.combat.meleeAttack = tracking?.maximumRange !== undefined ? tracking?.maximumRange === 0 : false;

    return input;
}
