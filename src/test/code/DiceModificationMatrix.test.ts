import * as T from '../../code/Types';

import DiceModificationMatrix from '../../code/DiceModificationMatrix';

describe('DiceModificationMatrix', () => {
    it('initializes properly', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.getResultCount(T.AttackDieResult.Critical)).toEqual(1);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(2);
        expect(matrix.getResultCount(T.AttackDieResult.Surge)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Miss)).toEqual(3);
    });

    it('convert up as expected', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Black, result: T.AttackDieResult.Surge },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.tryConvertResult(T.AttackDieResult.Hit, T.AttackDieResult.Critical)).toEqual(false);
        expect(matrix.tryConvertResult(T.AttackDieResult.Surge, T.AttackDieResult.Hit)).toEqual(true);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(1);
        expect(matrix.getResultCount(T.AttackDieResult.Surge)).toEqual(0);
        expect(matrix.tryConvertResult(T.AttackDieResult.Surge, T.AttackDieResult.Hit)).toEqual(false);
        expect(matrix.tryConvertResult(T.AttackDieResult.Hit, T.AttackDieResult.Critical)).toEqual(true);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Critical)).toEqual(1);
    });

    it('convert down as expected', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.tryConvertResult(T.AttackDieResult.Hit, T.AttackDieResult.Miss)).toEqual(true);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Miss)).toEqual(1);
    });

    it('convert same die twice', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.tryConvertResult(T.AttackDieResult.Surge, T.AttackDieResult.Hit)).toEqual(true);
        expect(matrix.getResultCount(T.AttackDieResult.Surge)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(1);
        expect(matrix.tryConvertResult(T.AttackDieResult.Hit, T.AttackDieResult.Miss)).toEqual(true);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Miss)).toEqual(1);
    });

    it('convert back', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.tryConvertResult(T.AttackDieResult.Miss, T.AttackDieResult.Hit)).toEqual(true);
        expect(matrix.getResultCount(T.AttackDieResult.Miss)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(1);
        expect(matrix.tryConvertResult(T.AttackDieResult.Hit, T.AttackDieResult.Miss)).toEqual(true);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Miss)).toEqual(1);
    });

    it('convert multiple dice', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.tryConvertResultCount(T.AttackDieResult.Surge, T.AttackDieResult.Hit, 7)).toEqual(4);
        expect(matrix.getResultCount(T.AttackDieResult.Surge)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(4);
        expect(matrix.tryConvertResultCount(T.AttackDieResult.Hit, T.AttackDieResult.Critical, 2)).toEqual(2);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(2);
        expect(matrix.getResultCount(T.AttackDieResult.Critical)).toEqual(2);
    });

    it('get reroll indexes', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Surge },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.tryConvertResult(T.AttackDieResult.Surge, T.AttackDieResult.Critical)).toEqual(true);
        expect(matrix.getResultCount(T.AttackDieResult.Surge)).toEqual(2);
        expect(matrix.getResultCount(T.AttackDieResult.Critical)).toEqual(1);
        expect(matrix.tryConvertResultCount(T.AttackDieResult.Surge, T.AttackDieResult.Miss, 2)).toEqual(2);
        expect(matrix.getResultCount(T.AttackDieResult.Surge)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Miss)).toEqual(2);

        expect(matrix.getRerollIndexes(0, 2)).toStrictEqual([0, 1]);
        expect(matrix.getRerollIndexes(2, 0)).toStrictEqual([2, 4]);
    });

    it('returns expected conversions', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Surge },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.tryConvertResult(T.AttackDieResult.Surge, T.AttackDieResult.Critical)).toEqual(true);
        expect(matrix.getResultCount(T.AttackDieResult.Surge)).toEqual(2);
        expect(matrix.getResultCount(T.AttackDieResult.Critical)).toEqual(1);
        expect(matrix.tryConvertResultCount(T.AttackDieResult.Surge, T.AttackDieResult.Miss, 2)).toEqual(2);
        expect(matrix.getResultCount(T.AttackDieResult.Surge)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Miss)).toEqual(2);

        expect(matrix.getConversions()).toStrictEqual([
            { roll: { color: T.DieColor.Red, result: T.AttackDieResult.Surge }, conversion: T.AttackDieResult.Miss },
            { roll: { color: T.DieColor.Black, result: T.AttackDieResult.Surge }, conversion: T.AttackDieResult.Miss },
            { roll: { color: T.DieColor.White, result: T.AttackDieResult.Hit }, conversion: T.AttackDieResult.Hit },
            { roll: { color: T.DieColor.White, result: T.AttackDieResult.Hit }, conversion: T.AttackDieResult.Hit },
            { roll: { color: T.DieColor.White, result: T.AttackDieResult.Surge }, conversion: T.AttackDieResult.Critical },
        ]);
    });

    it('converts values leaving expected amount', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.tryConvertResultAllExcept(T.AttackDieResult.Hit, T.AttackDieResult.Miss, 4)).toEqual(3);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(4);
        expect(matrix.getResultCount(T.AttackDieResult.Miss)).toEqual(3);
    });

    it('does not convert values if less than expected remaining', () => {
        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
        ];
        const matrix = new DiceModificationMatrix(rolls);

        expect(matrix.tryConvertResultAllExcept(T.AttackDieResult.Hit, T.AttackDieResult.Miss, 4)).toEqual(0);
        expect(matrix.getResultCount(T.AttackDieResult.Hit)).toEqual(3);
        expect(matrix.getResultCount(T.AttackDieResult.Miss)).toEqual(3);
    });
});
