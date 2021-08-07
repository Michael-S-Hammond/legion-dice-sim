export enum DieColor {
  Red = "red",
  Black = "black",
  White = "white",
}

export enum AttackDieResult {
  Critical = 1,
  Hit = 2,
  Surge = 3,
  Miss = 4,
}

export type AttackRoll = {
  color: DieColor,
  result: AttackDieResult,
}

export enum AttackSurgeConversion {
  Blank = 1,
  Hit = 2,
  Critical = 3,
}

export enum Cover {
  None = "none",
  Light = "light",
  Heavy = "heavy",
}

export enum DefenseDieResult {
  Block = 1,
  Surge = 2,
  Blank = 3,
}

export type AbilityX = {
  active: boolean,
  value: number,
}

export type OffenseTokens = {
  aim: number,
  surge: number,
}

export type OffenseInput = {
  redDice: number,
  blackDice: number,
  whiteDice: number,
  surge: AttackSurgeConversion,
  tokens: OffenseTokens,
  blast: boolean,
  criticalX: AbilityX,
  duelist: boolean,
  highVelocity: boolean,
  impactX: AbilityX,
  ionX: AbilityX,
  jediHunter: boolean,
  lethalX: AbilityX,
  makashiMastery: boolean,
  marksman: boolean,
  pierceX: AbilityX,
  preciseX: AbilityX,
  ramX: AbilityX,
  sharpshooterX: AbilityX,
}

export type DefenseTokens = {
  dodge: number,
  observation: number,
  shield: number,
  suppression: number
  surge: number,
}

export type DefenseInput = {
  dieColor: DieColor,
  surge: boolean,
  tokens: DefenseTokens,
  cover: Cover,
  armor: boolean,
  armorX: AbilityX,
  block: boolean,
  dangerSenseX: AbilityX,
  deflect: boolean,
  djemSoMastery: boolean,
  duelist: boolean,
  hasForceUpgrades: boolean,
  immuneBlast: boolean,
  immunePierce: boolean,
  impervious: boolean,
  lowProfile: boolean,
  outmaneuver: boolean,
  soresuMastery: boolean,
  uncannyLuckX: AbilityX,
}

export type CombatInput = {
  guardian: AbilityX,
  meleeAttack: boolean,
};

export type AttackInput = {
  offense: OffenseInput,
  defense: DefenseInput,
  combat: CombatInput,
}

export type AttackResult = {
  criticals: number,
  hits: number,
  surges: number,
  misses: number,
}

export type DefenseResult = {
  forcedSaves: number,
  blocks: number,
  surges: number,
  blanks: number,
  wounds: number,
}

export type AttackOutput = {
  attack: AttackResult,
  defense: DefenseResult,
}

export type Stats = {
  mean: number,
  median: number,
  stddev: number,
}

export type AttackSummary = {
  attackCount: number,
  critical: Array<number>,
  hit: Array<number>,
  attackSurge: Array<number>,
  forcedSaves: Array<number>,
  forcedSaveStats: Stats,
  blocks: Array<number>,
  defenseSurge: Array<number>,
  wounds: Array<number>,
  woundStats: Stats
}

export type CombinedAttackOutput = {
  firstAttack: AttackOutput,
  summary: AttackSummary,
}

export enum ResultOutput {
  None = 1,
  Single = 2,
  Graph = 3,
}

export function createDefaultAttackInput(): AttackInput {
  return {
    offense: {
      redDice: 0,
      blackDice: 0,
      whiteDice: 0,
      surge: AttackSurgeConversion.Blank,
      tokens: {
        aim: 0,
        surge: 0,
      },
      blast: false,
      criticalX: { active: false, value: 1 },
      duelist: false,
      highVelocity: false,
      impactX: { active: false, value: 1 },
      ionX: { active: false, value: 1 },
      jediHunter: false,
      lethalX: { active: false, value: 1 },
      makashiMastery: false,
      marksman: false,
      pierceX: { active: false, value: 1 },
      preciseX: { active: false, value: 1 },
      ramX: { active: false, value: 1 },
      sharpshooterX: { active: false, value: 1 },
    },
    defense: {
      dieColor: DieColor.White,
      surge: true,
      tokens: {
        dodge: 0,
        observation: 0,
        shield: 0,
        suppression: 0,
        surge: 0,
      },
      cover: Cover.None,
      armor: false,
      armorX: { active: false, value: 1 },
      block: false,
      dangerSenseX: { active: false, value: 1 },
      deflect: false,
      djemSoMastery: false,
      duelist: false,
      hasForceUpgrades: false,
      immuneBlast: false,
      immunePierce: false,
      impervious: false,
      lowProfile: false,
      outmaneuver: false,
      soresuMastery: false,
      uncannyLuckX: { active: false, value: 1 }
    },
    combat: {
      guardian: { active: false, value: 1 },
      meleeAttack: false,
    },
  }
}

function copyAbilityX(original: AbilityX): AbilityX {
  return {
    active: original.active,
    value: original.value
  };
}

export function cloneAttackInput(original: AttackInput): AttackInput {
  return {
    offense: {
      redDice: original.offense.redDice,
      blackDice: original.offense.blackDice,
      whiteDice: original.offense.whiteDice,
      surge: original.offense.surge,
      tokens: {
        aim: original.offense.tokens.aim,
        surge: original.offense.tokens.surge,
      },
      blast: original.offense.blast,
      criticalX: copyAbilityX(original.offense.criticalX),
      duelist: original.offense.duelist,
      highVelocity: original.offense.highVelocity,
      impactX: copyAbilityX(original.offense.impactX),
      ionX: copyAbilityX(original.offense.ionX),
      jediHunter: original.offense.jediHunter,
      lethalX: copyAbilityX(original.offense.lethalX),
      makashiMastery: original.offense.makashiMastery,
      marksman: original.offense.marksman,
      pierceX: copyAbilityX(original.offense.pierceX),
      preciseX: copyAbilityX(original.offense.preciseX),
      ramX: copyAbilityX(original.offense.ramX),
      sharpshooterX: copyAbilityX(original.offense.sharpshooterX),
    },
    defense: {
      dieColor: original.defense.dieColor,
      surge: original.defense.surge,
      tokens: {
        dodge: original.defense.tokens.dodge,
        observation: original.defense.tokens.observation,
        shield: original.defense.tokens.shield,
        suppression: original.defense.tokens.suppression,
        surge: original.defense.tokens.surge,
      },
      cover: original.defense.cover,
      armor: original.defense.armor,
      armorX: copyAbilityX(original.defense.armorX),
      block: original.defense.block,
      dangerSenseX: copyAbilityX(original.defense.dangerSenseX),
      deflect: original.defense.deflect,
      djemSoMastery: original.defense.djemSoMastery,
      duelist: original.defense.duelist,
      hasForceUpgrades: original.defense.hasForceUpgrades,
      immuneBlast: original.defense.immuneBlast,
      immunePierce: original.defense.immunePierce,
      impervious: original.defense.impervious,
      lowProfile: original.defense.lowProfile,
      outmaneuver: original.defense.outmaneuver,
      soresuMastery: original.defense.soresuMastery,
      uncannyLuckX: copyAbilityX(original.defense.uncannyLuckX),
    },
    combat: {
      guardian: copyAbilityX(original.combat.guardian),
      meleeAttack: original.combat.meleeAttack,
    },
  };
}
