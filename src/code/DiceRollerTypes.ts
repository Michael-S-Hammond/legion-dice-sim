import * as T from './Types';
import DiceModificationMatrix from './DiceModificationMatrix';

export type AttackResultStatus = {
    attackResult: T.AttackResult,
    modificationMatrix: DiceModificationMatrix,
    defenseResult: T.DefenseResult,
    modifiedDefenseResult: ModifiedDefenseResult,
};

type ModifiedDefenseResult = {
    blocks: number,
    surges: number,
    blanks: number,
};
