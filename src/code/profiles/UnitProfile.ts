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

export enum Sidearm {
    melee = "melee",
    ranged = "ranged"
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
    sidearm?: Sidearm,
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
    armament = 'armament',
    command = 'command',
    comms = 'comms',
    counterpart = 'counterpart',
    crew = 'crew',
    force = 'force',
    gear = 'gear',
    generator = 'generator',
    grenades = 'grenades',
    hardpoint = 'hardpoint',
    heavyWeapon = 'heavyWeapon',
    ordinance = 'ordinance',
    personnel = 'personnel',
    pilot = 'pilot',
    training = 'training'
}

export enum AiActions {
    attack = "attack",
    dodge = "dodge",
    move = "move"
}

export type CapacityUnitKeyword = {
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
    meleePierce = "meleePierce",
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
    counterpart?: string,
    cover?: T.Cover,
    covertOps?: boolean,
    cunning?: boolean,
    dangerSense?: number,
    dauntless?: boolean,
    defend?: number,
    deflect?: boolean,
    demoralize?: number,
    detachment?: string,
    direct?: UnitCriteria,
    disciplined?: number,
    disengage?: boolean,
    distract?: boolean,
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
    noncombatant?: boolean,
    observe?: number,
    outmaneuver?: boolean,
    override?: number,
    precise?: number,
    pullingTheStrings?: boolean,
    quickThinking?: boolean,
    ready?: number,
    recharge?: number,
    regenerate?: number,
    reinforcements?: boolean,
    relentless?: boolean,
    reliable?: number,
    repair?: CapacityUnitKeyword,
    reposition?: boolean
    retinue?: UnitCriteria,
    scale?: boolean,
    scout?: number,
    scoutingParty?: number,
    secretMission?: boolean,
    sentinel?: boolean,
    sharpshooter?: number,
    shielded?: number,
    small?: boolean,
    smoke?: number,
    soresuMastery?: boolean,
    speeder?: number,
    spotter?: number,
    spur?: boolean,
    stationary?: boolean,
    steady?: boolean,
    strategize?: number,
    tactical?: number,
    takeCover?: number,
    target?: number,
    teamwork?: string,
    tempted?: boolean,
    transport?: Transport,
    treat?: CapacityUnitKeyword,
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
    defenseDie: T.DieColor,
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

const units: Array<UnitProfile> = (<Array<UnitProfile>>(unitsFile.units)).sort((first: UnitProfile, second: UnitProfile) => {
    const nameResult = first.name.localeCompare(second.name);
    const firstSubtitle = first.subtitle ? first.subtitle : "";
    const secondSubtitle = second.subtitle ? second.subtitle : "";
    const subtitleResult = firstSubtitle?.localeCompare(secondSubtitle);

    return nameResult !== 0 ? nameResult : subtitleResult;
});

export function isRangeCompatible(weapon: Weapon, minimumRange: number, maximumRange?: number) : boolean {
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
