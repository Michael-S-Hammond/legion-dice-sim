import upgradesFile from '../../data/upgrades.json';

import * as UP from './UnitProfile';

export type Restriction = {
    unit?: string,
    faction?: UP.Faction,
    rank?: UP.Rank,
    type?: UP.UnitType
}

export interface Upgrade extends UP.NamedItem {
    type: string,
    unique?: boolean,
    points: number,
    keywords?: UP.UnitKeyword,
    restrictions?: Array<Restriction>
}

export interface ArmamentUpgrade extends Upgrade {
    type: UP.UnitUpgrade.armament,
    weapon: UP.Weapon
}

export interface ForceUpgrade extends Upgrade {
    type: UP.UnitUpgrade.force
}

export interface GrenadeUpgrade extends Upgrade {
    type: UP.UnitUpgrade.grenades,
    weapon?: UP.Weapon,
    applyWeaponKeywordsOnce?: boolean
}

export interface HeavyWeaponUpgrade extends Upgrade {
    type: UP.UnitUpgrade.heavyWeapon,
    weapon?: UP.Weapon
}

export interface PilotUpgradeCard extends Upgrade {
    type: UP.UnitUpgrade.pilot
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
