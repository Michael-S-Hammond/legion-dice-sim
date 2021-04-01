import * as T from '../../code/Types';

import ArmorXRerollStrategy from '../../code/ArmorXRerollStrategy';
import { RerollReason, RemainingRerolls } from '../../code/RerollStrategy';
import RerollStrategyFactory from '../../code/RerollStrategyFactory';

describe('ArmorXRerollStrategy', () => {
    it('does not handle if no armor', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        expect(strategy.shouldHandle(input, RerollReason.ObservationToken)).toEqual(false);
    });

    it('does not handle if armor', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        expect(strategy.shouldHandle(input, RerollReason.ObservationToken)).toEqual(false);
    });

    it('handles armor X', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        expect(strategy.shouldHandle(input, RerollReason.ObservationToken)).toEqual(true);
    });

    it('is retrieved from factory correctly', () => {
        const factory = new RerollStrategyFactory();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        expect(factory.selectStrategy(input, RerollReason.AimToken) instanceof ArmorXRerollStrategy).toEqual(true);
    });

    it('handles armor X, cover >= possible hits', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.defense.cover = T.Cover.Heavy;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([0, 2]);
    });

    it('handles armor X, cover >= possible hits with impact X', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.defense.cover = T.Cover.Heavy;
        input.offense.impactX.active = true;
        input.offense.impactX.value = 2;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([0, 2]);
    });

    it('handles armor X, cover + armor X >= possible hits', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.defense.cover = T.Cover.Heavy;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([0, 2]);
    });

    it('handles armor X, cover + armor X < possible hits', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.defense.cover = T.Cover.Heavy;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([1]);
    });

    it('handles armor X, cover + armor X + impact X < possible hits', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.defense.cover = T.Cover.Heavy;
        input.offense.impactX.active = true;
        input.offense.impactX.value = 2;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([2]);
    });

    it('handles armor X, possible hits > cover & cover + armor X + impact X > possible hits', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.defense.cover = T.Cover.Heavy;
        input.offense.impactX.active = true;
        input.offense.impactX.value = 2;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual(undefined);
    });

    it('handles armor X, possible hits < cover + impact X + armorX but > cover + impact X', () => {
        const strategy = new ArmorXRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.defense.cover = T.Cover.Heavy;
        input.offense.impactX.active = true;
        input.offense.impactX.value = 2;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([0]);
    });

    it('handles armor X, prefers lethal when all can be converted, no pierce', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        const strategy = new ArmorXRerollStrategy();

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

    it('handles armor X, prefers lethal when all can be converted, with pierce', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        input.offense.pierceX.active = true;
        input.offense.pierceX.value = 1;
        const strategy = new ArmorXRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Critical },
            { color: T.DieColor.Black, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual(undefined);
    });

    it('handles armor X, prefers reroll when lethal that cannot be converted, no pierce', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        const strategy = new ArmorXRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([0, 2]);
    });

    it('handles armor X, prefers reroll when lethal that cannot be converted, with pierce', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        input.offense.pierceX.active = true;
        input.offense.pierceX.value = 2;
        const strategy = new ArmorXRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([0, 2]);
    });

    it('handles armor X, ensure observe tokens do not trigger lethal', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        const strategy = new ArmorXRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
        ];
        const rerollDiceCount = 1;
        const reason = RerollReason.ObservationToken;
        const remaining : RemainingRerolls = { aimTokens: 0, observationTokens: 1 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([1]);
    });

    it('handles ram', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.offense.ramX.active = true;
        input.offense.ramX.value = 2;
        input.combat.meleeAttack = true;
        const strategy = new ArmorXRerollStrategy();

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

    it('ignores ram for range attack', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        input.defense.armorX.value = 2;
        input.offense.ramX.active = true;
        input.offense.ramX.value = 2;
        const strategy = new ArmorXRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
        ];
        const rerollDiceCount = 2;
        const reason = RerollReason.AimToken;
        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([0, 1]);
    });
});
