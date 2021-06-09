import upgradesFile from '../../data/upgrades.json';

import * as UP from './UnitProfile';

export type Restrictions = {
    unit?: Array<string>,
    faction?: Array<UP.Faction>,
    unitType?: Array<UP.UnitType>
}

export interface Upgrade {
    type: string,
    name: string,
    unique?: boolean,
    points: number,
    restrictions?: Restrictions
}

export interface ArmamentUpgrade extends Upgrade {
    type: UP.UnitUpgrade.armament,
    weapon: UP.Weapon
}

export interface ForceUpgrade extends Upgrade {
    type: UP.UnitUpgrade.force
}

export interface HeavyWeaponUpgrade extends Upgrade {
    type: UP.UnitUpgrade.heavyWeapon,
    weapon: UP.Weapon
}

export interface PilotUpgradeCard extends Upgrade {
    type: UP.UnitUpgrade.pilot,
    keywords?: UP.UnitKeyword
}

export interface UpgradeCardRegistry {
    HeavyWeaponUpgradeCard: HeavyWeaponUpgrade,
    PilotUpgradeCard: PilotUpgradeCard
}

export type UpgradeCardType = UpgradeCardRegistry[keyof UpgradeCardRegistry];

const upgrades: Array<Upgrade> = <Array<Upgrade>>(upgradesFile.upgrades);

export function getUpgrades() : Array<Upgrade> {
    return upgrades;
}
