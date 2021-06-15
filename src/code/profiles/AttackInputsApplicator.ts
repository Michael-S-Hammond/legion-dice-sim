import * as T from '../Types';
import * as UP from './UnitProfile';
import * as UC from './UpgradeCard';

function getValueX(value: number | null | undefined, multiplier: number) : T.AbilityX {
    return value ? { active: true, value: value * multiplier } : { active: false, value: 1 };
}
function getBoolean(value: boolean | null | undefined) : boolean {
    return value ? true : false;
}

function isRangeCompatible(weapon1: UP.Weapon, weapon2: UP.Weapon | null) : boolean {
    if(weapon2 === null) {
        return true;
    }

    if(weapon1.minimumRange === 0 && weapon2.minimumRange === 0) {
        return true;
    }

    if((weapon1.minimumRange > 0 || (weapon1.maximumRange && weapon1.maximumRange > 0)) &&
        (weapon2.minimumRange > 0 || (weapon2.maximumRange && weapon2.maximumRange > 0))) {
        return true;
    }

    return false;
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

function applyUpgradeKeywords(offense: T.OffenseInput, keywords: UP.UnitKeyword) {
    if(keywords.duelist) {
        offense.duelist = true;
    }
    if(keywords.jediHunter) {
        offense.jediHunter = true;
    }
    if(keywords.makashiMastery) {
        offense.makashiMastery = true;
    }
    applyValueXKeyword(keywords.precise, offense.preciseX);
    applyValueXKeyword(keywords.sharpshooter, offense.sharpshooterX);
}

function applyWeaponKeywords(offense: T.OffenseInput, keywords: UP.WeaponKeywords, unitCount: number) {
    if(keywords.blast) {
        offense.blast = true;
    }
    applyValueXKeyword(keywords.critical, offense.criticalX, unitCount);
    if(!keywords.highVelocity) {
        offense.highVelocity = false;
    }
    applyValueXKeyword(keywords.impact, offense.impactX, unitCount);
    applyValueXKeyword(keywords.ion, offense.ionX, unitCount);
    applyValueXKeyword(keywords.lethal, offense.lethalX, unitCount);
    applyValueXKeyword(keywords.pierce, offense.pierceX, unitCount);
    applyValueXKeyword(keywords.ram, offense.ramX, unitCount);
    if(keywords.surgeCrit) {
        offense.surge = T.AttackSurgeConversion.Critical;
    }
}

function applyGrenadesUpgrade(offense: T.OffenseInput, profile: UP.UnitProfile, weapon: UP.Weapon | null, upgrade: UC.GrenadeUpgrade) : void {
    if(upgrade.weapon !== undefined && isRangeCompatible(upgrade.weapon, weapon)) {
        offense.redDice += upgrade.weapon.dice.red * profile.miniCount;
        offense.blackDice += upgrade.weapon.dice.black * profile.miniCount;
        offense.whiteDice += upgrade.weapon.dice.white * profile.miniCount;

        if(upgrade.keywords) {
            applyUpgradeKeywords(offense, upgrade.keywords);
        }
        if(upgrade.weapon.keywords) {
            const multiplier = upgrade.applyWeaponKeywordsOnce ? 1 : profile.miniCount;
            applyWeaponKeywords(offense, upgrade.weapon.keywords, multiplier);
        }
    } else if (weapon !== null) {
        offense.redDice += weapon.dice.red;
        offense.blackDice += weapon.dice.black;
        offense.whiteDice += weapon.dice.white;
    }
}

function applyHeavyWeaponUpgrade(offense: T.OffenseInput, profile: UP.UnitProfile, weapon: UP.Weapon | null, upgrade: UC.HeavyWeaponUpgrade) : void {
    if(upgrade.weapon !== undefined && isRangeCompatible(upgrade.weapon, weapon)) {
        offense.redDice += upgrade.weapon.dice.red;
        offense.blackDice += upgrade.weapon.dice.black;
        offense.whiteDice += upgrade.weapon.dice.white;

        if(upgrade.keywords) {
            applyUpgradeKeywords(offense, upgrade.keywords);
        }
        if(upgrade.weapon.keywords) {
            applyWeaponKeywords(offense, upgrade.weapon.keywords, 1);
        }
    } else if (weapon !== null) {
        offense.redDice += weapon.dice.red;
        offense.blackDice += weapon.dice.black;
        offense.whiteDice += weapon.dice.white;
    }
}

function applyUpgrades(offense: T.OffenseInput, profile: UP.UnitProfile, weapon: UP.Weapon | null, upgrade: UC.Upgrade) : void {
    switch(upgrade.type) {
        // upgrades handled in createAttackInputsFromProfile(...)
        case UP.UnitUpgrade.grenades:
            applyGrenadesUpgrade(offense, profile, weapon, upgrade as UC.GrenadeUpgrade);
            break;
        case UP.UnitUpgrade.heavyWeapon:
            applyHeavyWeaponUpgrade(offense, profile, weapon, upgrade as UC.HeavyWeaponUpgrade);
            break;
    }
}

export function createAttackInputsFromProfile(profile: UP.UnitProfile, weapon: UP.Weapon | null, upgrades: Array<UC.Upgrade>, tokens: T.OffenseTokens) : T.AttackInput {
    let activeWeapon = weapon;
    upgrades.forEach(u => {
        if(u.type === UP.UnitUpgrade.grenades && (u as UC.GrenadeUpgrade).weapon) {
            activeWeapon = null;
        } else if(u.type === UP.UnitUpgrade.armament && (u as UC.ArmamentUpgrade).weapon) {
            activeWeapon = (u as UC.ArmamentUpgrade).weapon;
            if(u.keywords) {
                applyUpgradeKeywords(offense, u.keywords);
            }
        }
    });

    const offense = {
        redDice: activeWeapon === null ? 0 : activeWeapon.dice.red * profile.miniCount,
        blackDice: activeWeapon === null ? 0 : activeWeapon.dice.black * profile.miniCount,
        whiteDice: activeWeapon === null ? 0 : activeWeapon.dice.white * profile.miniCount,
        surge: UP.convertUnitProfileSurgeToAttackSurge(profile.attackSurge),
        tokens: tokens,
        blast: getBoolean(activeWeapon?.keywords?.blast),
        criticalX: getValueX(activeWeapon?.keywords?.critical, profile.miniCount),
        duelist: getBoolean(profile.keywords?.duelist),
        highVelocity: getBoolean(activeWeapon?.keywords?.highVelocity),
        impactX: getValueX(activeWeapon?.keywords?.impact, profile.miniCount),
        ionX: getValueX(activeWeapon?.keywords?.ion, profile.miniCount),
        jediHunter: getBoolean(profile.keywords?.jediHunter),
        lethalX: getValueX(activeWeapon?.keywords?.lethal, profile.miniCount),
        makashiMastery: getBoolean(profile.keywords?.makashiMastery),
        pierceX: getValueX(activeWeapon?.keywords?.pierce, profile.miniCount),
        preciseX: getValueX(profile.keywords?.precise, 1),
        ramX: getValueX(activeWeapon?.keywords?.ram, profile.miniCount),
        sharpshooterX: getValueX(profile.keywords?.sharpshooter, 1)
    };

    upgrades.forEach(u => {
        applyUpgrades(offense, profile, activeWeapon, u);
    });

    const input = T.createDefaultAttackInput();
    input.offense = offense;

    // TODO: Fix this for case where we are not using the default weapon (i.e. grenades)
    input.combat.meleeAttack = activeWeapon?.maximumRange !== null ? activeWeapon?.maximumRange === 0 : false;

    return input;
}
