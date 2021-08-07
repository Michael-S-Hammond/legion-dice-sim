import * as T from '../../code/Types';
import * as DRT from '../../code/DiceRollerTypes';
import * as RS from '../../code/RerollStrategy';
import * as RSH from '../../code/RerollStrategyHelpers';

import DiceModificationMatrix from 'code/DiceModificationMatrix';

describe('RerollStrategyHelper', () => {
    describe('getMarksmanConversions', () => {
        it('handles converting one blank to hit', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 2;
            input.offense.marksman = true;
            const rerolls: RS.RemainingRerolls = {
                aimTokens: 1,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 1, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(0);
        });

        it('handles converting two blanks to hits', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 3;
            input.offense.marksman = true;
            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 0, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(2);
            expect(conversions.hitsToCrits).toEqual(0);
        });

        it('handles not converting if less than cover', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 3;
            input.offense.marksman = true;
            input.defense.cover = T.Cover.Heavy;
            const rerolls: RS.RemainingRerolls = {
                aimTokens: 1,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 0, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(0);
            expect(conversions.hitsToCrits).toEqual(0);
        });

        it('handles converting to crit if cannot convert to hits', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 3;
            input.offense.marksman = true;
            input.defense.cover = T.Cover.Heavy;
            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 0, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(1);
        });

        it('handles multiple crits if only one hit possible', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 3;
            input.offense.marksman = true;
            input.defense.cover = T.Cover.Heavy;
            const rerolls: RS.RemainingRerolls = {
                aimTokens: 4,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 0, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(2);
            expect(conversions.hitsToCrits).toEqual(2);
        });

        it('handles nightmare (Armor X - 1)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.lethalX.active = true;
            input.offense.lethalX.value = 1;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 3;
            input.defense.cover = T.Cover.Heavy;
            input.defense.armorX.active = true;
            input.defense.armorX.value = 2;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 0, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(1);
        });

        it('handles nightmare (Armor X - 2)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.lethalX.active = true;
            input.offense.lethalX.value = 1;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 3;
            input.defense.cover = T.Cover.Heavy;
            input.defense.armorX.active = true;
            input.defense.armorX.value = 2;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 4, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(0);
        });

        it('handles nightmare (Armor X - 3)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.lethalX.active = true;
            input.offense.lethalX.value = 1;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 3;
            input.defense.cover = T.Cover.Heavy;
            input.defense.armorX.active = true;
            input.defense.armorX.value = 2;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 3, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(0);
        });

        it('handles nightmare (Armor X - 4)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.lethalX.active = true;
            input.offense.lethalX.value = 1;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 3;
            input.defense.cover = T.Cover.Heavy;
            input.defense.armorX.active = true;
            input.defense.armorX.value = 2;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 4,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 5, 5, rerolls);
            expect(conversions.blanksToHits).toEqual(0);
            expect(conversions.hitsToCrits).toEqual(0);
        });

        it('handles nightmare (Armor X - 5)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.lethalX.active = true;
            input.offense.lethalX.value = 1;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 3;
            input.defense.cover = T.Cover.Heavy;
            input.defense.armorX.active = true;
            input.defense.armorX.value = 2;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 2, 2, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(0);
        });

        it('handles nightmare (Armor X - 6)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.lethalX.active = true;
            input.offense.lethalX.value = 1;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 3;
            input.defense.cover = T.Cover.Heavy;
            input.defense.armorX.active = true;
            input.defense.armorX.value = 2;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 7, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(0);
        });

        it('handles nightmare (Armor X - 7)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.lethalX.active = true;
            input.offense.lethalX.value = 1;
            input.defense.cover = T.Cover.Heavy;
            input.defense.armorX.active = true;
            input.defense.armorX.value = 2;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 3, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(0);
            expect(conversions.hitsToCrits).toEqual(1);
        });

        // TODO: Fix this test. (Test is correct, result is wrong.)
        // it('handles nightmare (Armor X - 8)', () => {
        //     const input = T.createDefaultAttackInput();
        //     input.offense.redDice = 5;
        //     input.offense.marksman = true;
        //     input.offense.impactX.active = true;
        //     input.offense.impactX.value = 2;
        //     input.defense.cover = T.Cover.Heavy;
        //     input.defense.armorX.active = true;
        //     input.defense.armorX.value = 2;

        //     const rerolls: RS.RemainingRerolls = {
        //         aimTokens: 2,
        //         observationTokens: 0
        //     };

        //     const conversions = RSH.getMarksmanConversions(input, 3, 2, rerolls);
        //     expect(conversions.blanksToHits).toEqual(0);
        //     expect(conversions.hitsToCrits).toEqual(2);
        // });

        it('handles nightmare (Armor X - 9)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 7;
            input.offense.marksman = true;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 1;
            input.defense.cover = T.Cover.Heavy;
            input.defense.armorX.active = true;
            input.defense.armorX.value = 2;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 5, 2, rerolls);
            expect(conversions.blanksToHits).toEqual(0);
            expect(conversions.hitsToCrits).toEqual(2);
        });

        it('handles nightmare (Armor - 1)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 3;
            input.defense.armor = true;
            input.defense.cover = T.Cover.Heavy;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 3,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 8, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(0);
            expect(conversions.hitsToCrits).toEqual(3);
        });

        it('handles nightmare (Armor - 2)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 1;
            input.defense.armor = true;
            input.defense.cover = T.Cover.Heavy;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 1, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(0);
            expect(conversions.hitsToCrits).toEqual(1);
        });

        it('handles nightmare (Armor - 3)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 1;
            input.defense.armor = true;
            input.defense.cover = T.Cover.Heavy;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 2, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(0);
            expect(conversions.hitsToCrits).toEqual(2);
        });

        it('handles nightmare (Armor - 4)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 10;
            input.offense.marksman = true;
            input.offense.impactX.active = true;
            input.offense.impactX.value = 1;
            input.defense.armor = true;
            input.defense.cover = T.Cover.Heavy;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 0, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(1);
        });

        it('handles nightmare (Armor - 5)', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 1;
            input.offense.marksman = true;
            input.defense.armor = true;
            input.defense.cover = T.Cover.Heavy;

            const rerolls: RS.RemainingRerolls = {
                aimTokens: 5,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 0, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(1);
        });

        it('prefers lethal', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 3;
            input.offense.marksman = true;
            input.offense.lethalX.active = true;
            input.offense.lethalX.value = 1;
            const rerolls: RS.RemainingRerolls = {
                aimTokens: 1,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 1, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(0);
            expect(conversions.hitsToCrits).toEqual(0);
        });

        it('works with lethal', () => {
            const input = T.createDefaultAttackInput();
            input.offense.redDice = 3;
            input.offense.marksman = true;
            input.offense.lethalX.active = true;
            input.offense.lethalX.value = 1;
            const rerolls: RS.RemainingRerolls = {
                aimTokens: 2,
                observationTokens: 0
            };

            const conversions = RSH.getMarksmanConversions(input, 1, 0, rerolls);
            expect(conversions.blanksToHits).toEqual(1);
            expect(conversions.hitsToCrits).toEqual(0);
        });
    });
});
