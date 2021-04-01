import * as T from "./Types";

export enum RerollReason {
    AimToken = 1,
    ObservationToken = 2,
}

export type RemainingRerolls = {
    aimTokens: number,
    observationTokens: number,
}

export interface RerollStrategy {
    /**
     * This is a function that determines which dice should be rerolled in a given situation.
     * Dice will be ordered by color. (Red, black, white)
     * 
     * @param input The original inputs that created the attack pool.
     * @param rolls The current state of the dice after the rolls thus far.
     * @param rerollDiceCount The maximum number of dice that can be rerolled.
     * @param reason The reason for the reroll.
     * @param remaining The possible rerolls that are still remaining for this attack.
     * 
     * @returns An array of indexes for the dice to be rerolled or undefined if no dice should be rerolled.
     */
    readonly pickRerollDice:
        (input: T.AttackInput,
         rolls: T.AttackRoll[],
         rerollDiceCount: number,
         reason: RerollReason,
         remaining: RemainingRerolls) => number[] | undefined,

    /**
     * Determines if this strategy should be used to select dice to reroll in a given situation.
     * @param input The original inputs that created the attack pool.
     * @param reason The reason for the reroll.
     * 
     * @returns True if this strategy should be selected.
     */
    readonly shouldHandle:
        (input: T.AttackInput,
         reason: RerollReason) => boolean,
}
