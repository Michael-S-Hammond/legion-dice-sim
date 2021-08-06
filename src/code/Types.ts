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
  immuneMeleePierce: boolean,
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

export function createDefaultAttackInput() : AttackInput {
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
          immuneMeleePierce: false,
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

export function cloneAttackInput(original: AttackInput) : AttackInput {
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
        criticalX: {
          active: original.offense.criticalX.active,
          value: original.offense.criticalX.value
        },
        duelist: original.offense.duelist,
        highVelocity: original.offense.highVelocity,
        impactX: {
          active: original.offense.impactX.active,
          value: original.offense.impactX.value
        },
        ionX: {
          active: original.offense.ionX.active,
          value: original.offense.ionX.value
        },
        jediHunter: original.offense.jediHunter,
        lethalX: {
          active: original.offense.lethalX.active,
          value: original.offense.lethalX.value
        },
        makashiMastery: original.offense.makashiMastery,
        pierceX: {
          active: original.offense.pierceX.active,
          value: original.offense.pierceX.value
        },
        preciseX: {
          active: original.offense.preciseX.active,
          value: original.offense.preciseX.value
        },
        ramX: {
          active: original.offense.ramX.active,
          value: original.offense.ramX.value,
        },
        sharpshooterX: {
          active: original.offense.sharpshooterX.active,
          value: original.offense.sharpshooterX.value
        },
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
        armorX: {
          active: original.defense.armorX.active,
          value: original.defense.armorX.value
        },
        block: original.defense.block,
        dangerSenseX: {
          active: original.defense.dangerSenseX.active,
          value: original.defense.dangerSenseX.value
        },
        deflect: original.defense.deflect,
        djemSoMastery: original.defense.djemSoMastery,
        duelist: original.defense.duelist,
        hasForceUpgrades: original.defense.hasForceUpgrades,
        immuneBlast: original.defense.immuneBlast,
        immuneMeleePierce: original.defense.immuneMeleePierce,
        immunePierce: original.defense.immunePierce,
        impervious: original.defense.impervious,
        lowProfile: original.defense.lowProfile,
        outmaneuver: original.defense.outmaneuver,
        soresuMastery: original.defense.soresuMastery,
        uncannyLuckX: {
          active: original.defense.uncannyLuckX.active,
          value: original.defense.uncannyLuckX.value
        },
    },
    combat: {
      guardian: {
        active: original.combat.guardian.active,
        value: original.combat.guardian.value
      },
      meleeAttack: original.combat.meleeAttack,
    },
  };
}
