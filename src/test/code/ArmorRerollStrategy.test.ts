import * as T from '../../code/Types';

import ArmorRerollStrategy from '../../code/ArmorRerollStrategy';
import { RerollReason, RemainingRerolls } from '../../code/RerollStrategy';
import RerollStrategyFactory from '../../code/RerollStrategyFactory';

describe('ArmorRerollStrategy', () => {
    it('does not handle if no armor', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        expect(strategy.shouldHandle(input)).toEqual(false);
    });

    it('does not handle armor X', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armorX.active = true;
        expect(strategy.shouldHandle(input)).toEqual(false);
    });

    it('handles if armor', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        expect(strategy.shouldHandle(input)).toEqual(true);
    });

    it('is retrieved from factory correctly', () => {
        const factory = new RerollStrategyFactory();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        expect(factory.selectStrategy(input, RerollReason.AimToken) instanceof ArmorRerollStrategy).toEqual(true);
    });

    it('selects rerolls from misses', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Miss },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([0, 1]);
    });

    it('selects rerolls from hits', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Critical },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([1, 2]);
    });

    it('handles surge to crit', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.offense.surge = T.AttackSurgeConversion.Critical;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([2, 3]);
    });

    it('handles critical X', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.offense.criticalX.active = true;
        input.offense.criticalX.value = 2;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([0, 2]);
    });

    it('handles impact X', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.offense.impactX.active = true;
        input.offense.impactX.value = 2;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Critical },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([1, 4]);
    });

    it('handles impact X with surge to hit', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.offense.surge = T.AttackSurgeConversion.Hit;
        input.offense.impactX.active = true;
        input.offense.impactX.value = 2;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual([1]);
    });

    it('handles nothing to reroll', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.offense.surge = T.AttackSurgeConversion.Critical;
        input.offense.impactX.active = true;
        input.offense.impactX.value = 2;

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Surge },
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Critical },
            { color: T.DieColor.White, result: T.AttackDieResult.Hit },
            { color: T.DieColor.White, result: T.AttackDieResult.Surge },
        ];

        const remaining : RemainingRerolls = { aimTokens: 1, observationTokens: 0 };

        expect(strategy.pickRerollDice(input, rolls, 2, RerollReason.AimToken, remaining)).toStrictEqual(undefined);
    });

    it('handles rerolling hits if not possible to get through cover', () => {
        const strategy = new ArmorRerollStrategy();
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.defense.cover = T.Cover.Heavy;
        input.offense.surge = T.AttackSurgeConversion.Critical;
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

    it('prefers lethal when all can be converted, no pierce', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        const strategy = new ArmorRerollStrategy();

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
        input.defense.armor = true;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        input.offense.pierceX.active = true;
        input.offense.pierceX.value = 1;
        const strategy = new ArmorRerollStrategy();

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

    it('prefers reroll when lethal that cannot be converted, no pierce', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        const strategy = new ArmorRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Miss },
            { color: T.DieColor.Black, result: T.AttackDieResult.Hit },
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
        input.defense.armor = true;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        input.offense.pierceX.active = true;
        input.offense.pierceX.value = 2;
        const strategy = new ArmorRerollStrategy();

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

    it('ensure observe tokens do not trigger lethal', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.offense.lethalX.active = true;
        input.offense.lethalX.value = 1;
        const strategy = new ArmorRerollStrategy();

        const rolls: T.AttackRoll[] = [
            { color: T.DieColor.Red, result: T.AttackDieResult.Hit },
            { color: T.DieColor.Black, result: T.AttackDieResult.Miss },
            { color: T.DieColor.White, result: T.AttackDieResult.Critical },
        ];
        const rerollDiceCount = 1;
        const reason = RerollReason.ObservationToken;
        const remaining : RemainingRerolls = { aimTokens: 0, observationTokens: 1 };

        const indexes = strategy.pickRerollDice(input, rolls, rerollDiceCount, reason, remaining);
        expect(indexes).toStrictEqual([0]);
    });

    it('handles ram', () => {
        const input = T.createDefaultAttackInput();
        input.defense.armor = true;
        input.offense.ramX.active = true;
        input.offense.ramX.value = 2;
        input.combat.meleeAttack = true;
        const strategy = new ArmorRerollStrategy();

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
        input.defense.armor = true;
        input.offense.ramX.active = true;
        input.offense.ramX.value = 2;
        const strategy = new ArmorRerollStrategy();

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
