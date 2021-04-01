import * as T from '../../code/Types';
import { RerollReason, RemainingRerolls } from '../../code/RerollStrategy';
import RerollStrategyFactory from '../../code/RerollStrategyFactory';

import SimpleRerollStrategy from '../../code/SimpleRerollStrategy';

describe('SimpleRerollStrategy', () => {
    it('is retrieved from factory correctly', () => {
        const factory = new RerollStrategyFactory();
        const input = T.createDefaultAttackInput();
        // no armor or armor x
        expect(factory.selectStrategy(input, RerollReason.AimToken) instanceof SimpleRerollStrategy).toEqual(true);
    });

    it('shouldHandle returns true', () => {
        const input = T.createDefaultAttackInput();
        const strategy = new SimpleRerollStrategy();
        expect(strategy.shouldHandle(input, RerollReason.AimToken)).toEqual(true);
        expect(strategy.shouldHandle(input, RerollReason.ObservationToken)).toEqual(true);
    });

    it('rerolls misses', () => {
        const input = T.createDefaultAttackInput();
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([2, 3]);
    });

    it('rerolls surge -> misses', () => {
        const input = T.createDefaultAttackInput();
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([2, 3]);
    });

    it('rerolls multiple colors', () => {
        const input = T.createDefaultAttackInput();
        input.offense.preciseX.active;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
        ];
        const rerollDiceCount = 3;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([1, 2, 5]);
    });

    it('handles surge conversion', () => {
        const input = T.createDefaultAttackInput();
        input.offense.surge = T.AttackSurgeConversion.Critical;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([1, 5]);
    });

    it('handles critical X', () => {
        const input = T.createDefaultAttackInput();
        input.offense.criticalX.active = true;
        input.offense.criticalX.value = 2;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Critical },
            { color: T.DieColor.Black, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([2]);
    });

    it('handles nothing to reroll', () => {
        const input = T.createDefaultAttackInput();
        input.offense.surge = T.AttackSurgeConversion.Hit;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Critical },
            { color: T.DieColor.Black, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual(undefined);
    });

    it('handles enough dice to clear cover', () => {
        const input = T.createDefaultAttackInput();
        input.defense.cover = T.Cover.Heavy;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([2]);
    });

    it('handles not enough dice to clear cover', () => {
        const input = T.createDefaultAttackInput();
        input.defense.cover = T.Cover.Heavy;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([0, 1]);
    });

    it('prefers lethal when all can be converted, no pierce', () => {
        const input = T.createDefaultAttackInput();
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual(undefined);
    });

    it('prefers lethal when all can be converted, with pierce', () => {
        const input = T.createDefaultAttackInput();
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        input.offense.pierceX.active = true;
        input.offense.pierceX.value = 1;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual(undefined);
    });

    it('prefers reroll when lethal that cannot be converted, no pierce', () => {
        const input = T.createDefaultAttackInput();
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([0, 1]);
    });

    it('prefers reroll when lethal that cannot be converted, with pierce', () => {
        const input = T.createDefaultAttackInput();
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        input.offense.pierceX.active = true;
        input.offense.pierceX.value = 2;
        const strategy = new SimpleRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([2]);
    });
})
