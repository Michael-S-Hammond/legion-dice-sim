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
    creatureTrooper = "creatureTrooper",
    emplacementTrooper = "emplacementTrooper",
    trooper = "trooper",
    wookieTrooper = "wookieTrooper",
    groundVehicle = "groundVehicle",
    repulsorVehicle = "repulsorVehicle"
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

export enum FixedPosition {
    front = "front",
    rear = "rear"
}

export type WeaponKeywords = {
    critical?: number,
    cumbersome: boolean,
    fixed?: Array<FixedPosition>,
    impact?: number,
    lethal?: number,
    pierce?: number,
    ram?: number,
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

export enum HoverType {
    ground = "ground"
}

export enum Immune {
    blast = "blast",
    melee = "melee",
    pierce = "pierce",
    range1Weapons = "range1Weapons"
}

export enum TransportType {
    closed = "closed",
    open = "open"
}

export type Transport = {
    closed?: number,
    open?: number
}

export type WeakPoint = {
    rear?: number
}

export type UnitKeyword = {
    agile?: number,
    armor?: boolean,
    armorX?: number,
    arsenal?: number,
    charge?: boolean,
    climbingVehicle?: boolean,
    contingencies?: number,
    coordinate?: string,
    cover?: number,
    covertOps?: boolean,
    dangerSense?: number,
    dauntless?: boolean,
    defend?: number,
    deflect?: boolean,
    detachment?: string
    disengage?: boolean,
    duelist?: boolean,
    enrage?: number,
    equip?: Array<string>,
    expertClimber?: boolean,
    fireSupport?: boolean,
    flawed?: boolean,
    fullPivot?: boolean,
    grounded?: boolean,
    guardian?: number,
    gunslinger?: boolean,
    heavyWeaponTeam?: boolean,
    hover?: HoverType,
    immune?: Array<Immune>,
    immunePierce?: boolean,
    impervious?: boolean,
    inconspicuous?: boolean,
    indomitable?: boolean,
    infiltrate?: boolean,
    inspire?: number,
    jump?: number,
    lightTransport?: Transport,
    loadout?: boolean,
    lowProfile?: boolean,
    marksman?: boolean,
    masterOfTheForce?: number,
    nimble?: boolean,
    quickThinking?: boolean,
    ready?: number,
    relentless?: boolean,
    repair?: RepairUnitKeyword,
    reposition?: boolean
    retinue?: string,
    scale?: boolean,
    scout?: number,
    secretMission?: boolean,
    sentinel?: boolean,
    sharpshooter?: number,
    speeder?: number,
    stationary?: boolean,
    tactical?: number,
    takeCover?: number,
    teamwork?: string,
    transport?: Transport,
    uncannyLuck?: number,
    unhindered?: boolean,
    weakPoint?: WeakPoint
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
