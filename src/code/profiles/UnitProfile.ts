import unitsFile from '../../data/units.json';

import * as T from '../Types';

export enum Faction {
    rebel = "rebel",
    empire = "empire",
    separatist = "separatist",
    republic = "republic"
}

export enum Rank {
    commander = "commander",
    operative = "operative",
    corps = "corps",
    specialForces = "specialForces",
    support = "support",
    heavy = "heavy"
}

export enum UnitType {
    trooper = "trooper",
    wookieTrooper = "wookieTrooper",
    vehicle = "vehicle"
}

export enum DefenseDie {
    red = "red",
    white = "white"
}

export enum AttackSurge {
    blank = "blank",
    hit = "hit",
    critical = "critical"
}

export type WeaponKeywords = {
    impact?: number,
    lethal?: number,
    pierce?: number,
    suppressive?: boolean
}

export type AttackDice = {
    red: number,
    black: number,
    white: number
}

export type Weapon = {
    name: string,
    minimumRange: number,
    maximumRange?: number,
    dice: AttackDice,
    keywords?: WeaponKeywords
}

export enum UnitUpgrade {
    heavyWeapon = 'heavyWeapon',
    personnel = 'personnel',
    force = 'force',
    command = 'command',
    hardpoint = 'hardpoint',
    gear = 'gear',
    grenades = 'grenades',
    comms = 'comms',
    pilot = 'pilot',
    training = 'training',
    generator = 'generator',
    armament = 'armament',
    crew = 'crew',
    ordinance = 'ordinance'
}

export type RepairUnitKeyword = {
    value: number,
    capacity: number
}

export type UnitKeyword = {
    charge?: boolean,
    contingencies?: number,
    covertOps?: boolean,
    dangerSense?: number,
    deflect?: boolean,
    disengage?: boolean,
    enrage?: number,
    flawed?: boolean,
    grounded?: boolean,
    guardian?: number,
    gunslinger?: boolean,
    immunePierce?: boolean,
    impervious?: boolean,
    inconspicuous?: boolean,
    infiltrate?: boolean,
    inspire?: number,
    jump?: number,
    loadout?: boolean,
    lowProfile?: boolean,
    marksman?: boolean,
    masterOfTheForce?: number,
    nimble?: boolean,
    quickThinking?: boolean,
    repair?: RepairUnitKeyword,
    scale?: boolean,
    secretMission?: boolean,
    sharpshooter?: number,
    tactical?: number,
    takeCover?: number,
    teamwork?: string,
    uncannyLuck?: number
}

export type UnitProfile = {
    faction: Faction,
    name: string,
    subtitle?: string,
    unique?: boolean,
    rank: Rank,
    miniCount: number,
    points: number,
    unitType: UnitType,
    defenseDie: DefenseDie,
    wounds: number,
    courage?: number,
    resilience?: number,
    attackSurge: AttackSurge,
    defenseSurge: boolean,
    speed: number,
    weapons: Array<Weapon>,
    upgrades?: Array<UnitUpgrade>,
    keywords?: UnitKeyword
}

const units: Array<UnitProfile> = <Array<UnitProfile>>(unitsFile.units);

export function getUnits() : Array<UnitProfile> {
    return units;
}

export function convertUnitProfileSurgeToAttackSurge(surge: AttackSurge) : T.AttackSurgeConversion {
    switch(surge) {
        case AttackSurge.critical:
            return T.AttackSurgeConversion.Critical;
        case AttackSurge.hit:
            return T.AttackSurgeConversion.Hit;
        default:
            return T.AttackSurgeConversion.Blank;
    }
}
