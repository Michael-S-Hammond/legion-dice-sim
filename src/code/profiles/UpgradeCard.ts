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

export interface WeaponUpgrade extends Upgrade {
    weapon?: UP.Weapon
}

export interface ArmamentUpgrade extends WeaponUpgrade {
    type: UP.UnitUpgrade.armament
}

export interface ForceUpgrade extends Upgrade {
    type: UP.UnitUpgrade.force
}

export interface GrenadeUpgrade extends WeaponUpgrade {
    type: UP.UnitUpgrade.grenades,
    applyWeaponKeywordsOnce?: boolean
}

export interface HardpointUpgrade extends WeaponUpgrade {
    type: UP.UnitUpgrade.hardpoint
}

export interface HeavyWeaponUpgrade extends WeaponUpgrade {
    type: UP.UnitUpgrade.heavyWeapon
}

export interface PilotUpgradeCard extends Upgrade {
    type: UP.UnitUpgrade.pilot
}

export interface UpgradeCardRegistry {
    ArmamentUpgrade: ArmamentUpgrade,
    ForceUpgrade: ForceUpgrade,
    GrenadeUpgrade: GrenadeUpgrade,
    HardpointUpgrade: HardpointUpgrade,
    HeavyWeaponUpgradeCard: HeavyWeaponUpgrade,
    PilotUpgradeCard: PilotUpgradeCard
}

export type UpgradeCardType = UpgradeCardRegistry[keyof UpgradeCardRegistry];

const upgrades: Array<Upgrade> = <Array<Upgrade>>(upgradesFile.upgrades);

export function getUpgrades() : Array<Upgrade> {
    return upgrades;
}
