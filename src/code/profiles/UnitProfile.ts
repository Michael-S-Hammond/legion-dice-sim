import unitsFile from '../../data/units.json';

import * as T from '../Types';

export interface NamedItem {
    name: string;
}

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
    cloneTrooper = "cloneTrooper",
    creatureTrooper = "creatureTrooper",
    droidTrooper = "droidTrooper",
    emplacementTrooper = "emplacementTrooper",
    trooper = "trooper",
    wookieeTrooper = "wookieeTrooper",
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

export enum WeaponImmune {
    deflect = "deflect",
}

export type WeaponKeywords = {
    beam?: number,
    blast?: boolean,
    critical?: number,
    cumbersome?: boolean,
    cycle?: boolean,
    fixed?: Array<FixedPosition>,
    highVelocity?: boolean,
    immobilize?: number,
    immune?: Array<WeaponImmune>,
    impact?: number,
    ion?: number,
    lethal?: number,
    longShot?: number,
    reconfigure?: boolean,
    pierce?: number,
    poison?: number,
    ram?: number,
    scatter?: boolean,
    spray?: boolean,
    suppressive?: boolean,
    surgeCrit?: boolean,
    towCable?: boolean,
    versatile?: boolean
}

export type AttackDice = {
    red: number,
    black: number,
    white: number
}

export interface Weapon extends NamedItem {
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

export enum AiActions {
    attack = "attack",
    dodge = "dodge",
    move = "move"
}

export type RepairUnitKeyword = {
    value: number,
    capacity: number
}

export type Hover = {
    ground?: boolean,
    air?: number
}

export enum UnitImmune {
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

export type UnitCriteria = {
    rank?: Rank,
    type?: UnitType
}

export type WeakPoint = {
    rear?: number,
    sides?: number
}

export type UnitKeyword = {
    agile?: number,
    ai?: Array<AiActions>,
    armor?: boolean,
    armorX?: number,
    arsenal?: number,
    ataruMastery?: boolean,
    authoritative?: boolean,
    barrage?: boolean,
    block?: boolean,
    bolster?: number,
    bounty?: boolean,
    calculateOdds?: boolean,
    charge?: boolean,
    climbingVehicle?: boolean,
    compel?: boolean,
    contingencies?: number,
    coordinate?: Array<UnitCriteria>,
    cover?: number,
    covertOps?: boolean,
    cunning?: boolean,
    dangerSense?: number,
    dauntless?: boolean,
    defend?: number,
    deflect?: boolean,
    demoralize?: number,
    detachment?: string,
    direct?: UnitCriteria,
    disengage?: boolean,
    disciplined?: boolean,
    djemSoMastery?: boolean,
    duelist?: boolean,
    enrage?: number,
    entourage?: string,
    equip?: Array<string>,
    exemplar?: boolean,
    expertClimber?: boolean,
    fieldCommander?: boolean,
    fireSupport?: boolean,
    flawed?: boolean,
    fullPivot?: boolean,
    generator?: boolean,
    grounded?: boolean,
    guardian?: number,
    guidance?: boolean,
    gunslinger?: boolean,
    heavyWeaponTeam?: boolean,
    hover?: Hover,
    immune?: Array<UnitImmune>,
    immunePierce?: boolean,
    impervious?: boolean,
    incognito?: boolean,
    inconspicuous?: boolean,
    indomitable?: boolean,
    infiltrate?: boolean,
    inspire?: number,
    jediHunter?: boolean,
    jump?: number,
    juyoMastery?: boolean,
    leader?: boolean,
    lightTransport?: Transport,
    loadout?: boolean,
    lowProfile?: boolean,
    makashiMastery?: boolean,
    marksman?: boolean,
    masterOfTheForce?: number,
    nimble?: boolean,
    observe?: number,
    outmaneuver?: boolean,
    precise?: number,
    pullingTheStrings?: boolean,
    quickThinking?: boolean,
    ready?: number,
    recharge?: number,
    regenerate?: number,
    relentless?: boolean,
    reliable?: number,
    repair?: RepairUnitKeyword,
    reposition?: boolean
    retinue?: string,
    scale?: boolean,
    scout?: number,
    scoutingParty?: number,
    secretMission?: boolean,
    sentinel?: boolean,
    sharpshooter?: number,
    shielded?: number,
    smoke?: number,
    soresuMastery?: boolean,
    speeder?: number,
    spotter?: number,
    spur?: boolean,
    stationary?: boolean,
    steady?: boolean,
    tactical?: number,
    takeCover?: number,
    target?: number,
    teamwork?: string,
    tempted?: boolean,
    transport?: Transport,
    uncannyLuck?: number,
    unhindered?: boolean,
    weakPoint?: WeakPoint,
    wheelMode?: boolean
}

export interface UnitProfile extends NamedItem {
    faction: Faction,
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
