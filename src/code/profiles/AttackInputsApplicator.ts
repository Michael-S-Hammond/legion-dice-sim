import * as T from '../Types';
import * as UP from './UnitProfile';
import * as UC from './UpgradeCard';

function getValueX(value: number | null | undefined, multiplier: number) : T.AbilityX {
    return value ? { active: true, value: value * multiplier } : { active: false, value: 1 };
}
function getBoolean(value: boolean | null | undefined) : boolean {
    return value ? true : false;
}

function isRangeCompatible(weapon1: UP.Weapon, weapon2: UP.Weapon) : boolean {
    if(weapon1.minimumRange === 0 && weapon2.minimumRange === 0) {
        return true;
    }

    if((weapon1.minimumRange > 0 || (weapon1.maximumRange && weapon1.maximumRange > 0)) &&
        (weapon2.minimumRange > 0 || (weapon2.maximumRange && weapon2.maximumRange > 0))) {
        return true;
    }

    return false;
}

function applyHeavyWeaponUpgrade(offense: T.OffenseInput, profile: UP.UnitProfile, weapon: UP.Weapon, upgrade: UC.HeavyWeaponUpgrade) : void {
    if(isRangeCompatible(weapon, upgrade.weapon)) {
        offense.redDice += upgrade.weapon.dice.red;
        offense.blackDice += upgrade.weapon.dice.black;
        offense.whiteDice += upgrade.weapon.dice.white;
    } else {
        offense.redDice += weapon.dice.red;
        offense.blackDice += weapon.dice.black;
        offense.whiteDice += weapon.dice.white;
    }
}

function applyUpgrades(offense: T.OffenseInput, profile: UP.UnitProfile, weapon: UP.Weapon, upgrade: UC.Upgrade) : void {
    switch(upgrade.type) {
        case UP.UnitUpgrade.heavyWeapon:
            applyHeavyWeaponUpgrade(offense, profile, weapon, upgrade as UC.HeavyWeaponUpgrade);
    }
}

export function createAttackInputsFromProfile(profile: UP.UnitProfile, weapon: UP.Weapon, upgrades: Array<UC.Upgrade>, tokens: T.OffenseTokens) : T.AttackInput {
    const offense = {
        redDice: weapon.dice.red,
        blackDice: weapon.dice.black,
        whiteDice: weapon.dice.white,
        surge: UP.convertUnitProfileSurgeToAttackSurge(profile.attackSurge),
        tokens: tokens,
        blast: getBoolean(weapon.keywords?.blast),
        criticalX: getValueX(weapon.keywords?.critical, profile.miniCount),
        duelist: getBoolean(profile.keywords?.duelist),
        highVelocity: false,    // TODO: ...
        impactX: getValueX(weapon.keywords?.impact, profile.miniCount),
        ionX: { active: false, value: 1 },  // TODO: ...
        jediHunter: getBoolean(profile.keywords?.jediHunter),
        lethalX: getValueX(weapon.keywords?.lethal, profile.miniCount),
        makashiMastery: false,  // TODO: ...
        pierceX: getValueX(weapon.keywords?.pierce, profile.miniCount),
        preciseX: getValueX(profile.keywords?.precise, 1),
        ramX: getValueX(weapon.keywords?.ram, profile.miniCount),
        sharpshooterX: getValueX(profile.keywords?.sharpshooter, 1)
    };

    upgrades.forEach(u => {
        applyUpgrades(offense, profile, weapon, u);
    });

    const input = T.createDefaultAttackInput();
    input.offense = offense;
    input.combat.meleeAttack = weapon.maximumRange !== null ? weapon.maximumRange === 0 : false;

    return input;
}
