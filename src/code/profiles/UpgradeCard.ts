import upgradesFile from '../../data/upgrades.json';

import * as UP from './UnitProfile';

export type Restriction = {
    faction?: UP.Faction,
    rank?: UP.Rank,
    type?: UP.UnitType,
    unit?: string,
    upgrade?: UP.UnitUpgrade,
    not?: boolean
}

export interface Upgrade extends UP.NamedItem {
    type: UP.UnitUpgrade,
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

export interface CommandUpgrade extends Upgrade {
    type: UP.UnitUpgrade.command
}

export interface CommsUpgrade extends Upgrade {
    type: UP.UnitUpgrade.comms
}

export interface CrewUpgrade extends WeaponUpgrade {
    type: UP.UnitUpgrade.crew
}

export interface ForceUpgrade extends Upgrade {
    type: UP.UnitUpgrade.force
}

export interface GearUpgrade extends Upgrade {
    type: UP.UnitUpgrade.gear
}

export interface GeneratorUpgrade extends Upgrade {
    type: UP.UnitUpgrade.generator,
    weaponKeywords: UP.WeaponKeywords
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

export interface OrdinanceUpgrade extends WeaponUpgrade {
    type: UP.UnitUpgrade.ordinance
}

export interface PilotUpgradeCard extends Upgrade {
    type: UP.UnitUpgrade.pilot,
    weaponKeywords: UP.WeaponKeywords
}

export interface TrainingUpgradeCard extends Upgrade {
    type: UP.UnitUpgrade.training
}

export interface UpgradeCardRegistry {
    ArmamentUpgrade: ArmamentUpgrade,
    CommandUpgrade: CommandUpgrade,
    CommsUpgrade: CommsUpgrade,
    CrewUpgrade: CrewUpgrade,
    ForceUpgrade: ForceUpgrade,
    GearUpgrade: GearUpgrade,
    GeneratorUpgrade: GeneratorUpgrade,
    GrenadeUpgrade: GrenadeUpgrade,
    HardpointUpgrade: HardpointUpgrade,
    HeavyWeaponUpgradeCard: HeavyWeaponUpgrade,
    OrdinanceUpgrade: OrdinanceUpgrade,
    PilotUpgradeCard: PilotUpgradeCard,
    TrainingUpgradeCard: TrainingUpgradeCard
}

export type UpgradeCardType = UpgradeCardRegistry[keyof UpgradeCardRegistry];

const upgrades: Array<Upgrade> = <Array<Upgrade>>(upgradesFile.upgrades);

export function getUpgrades() : Array<Upgrade> {
    return upgrades;
}
