import * as T from '../../code/Types';
import * as DU from '../../code/DiceRoller';

describe('DiceRoller', () => {
    let diceRoller = new DU.DiceRoller();

    beforeEach(() => {
        diceRoller = new DU.DiceRoller();
    });

    test('Roll correct number of red attack dice', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            expect(color).toEqual(T.DieColor.Red);
            atkcount++;
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        diceRoller.simulateAttacks(1, atkInput);

        expect(atkcount).toEqual(3);
    });


    test('Roll correct number of black attack dice', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            expect(color).toEqual(T.DieColor.Black);
            atkcount++;
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 5;
        diceRoller.simulateAttacks(1, atkInput);

        expect(atkcount).toEqual(5);
    });


    test('Roll correct number of white attack dice', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            expect(color).toEqual(T.DieColor.White);
            atkcount++;
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.whiteDice = 7;
        diceRoller.simulateAttacks(1, atkInput);

        expect(atkcount).toEqual(7);
    });

    test('Roll correct number of red defense dice', () => {
        let defcount = 0;
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            expect(color).toEqual(T.DieColor.Red);
            defcount++;
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.defense.dieColor = T.DieColor.Red;
        diceRoller.simulateAttacks(1, atkInput);

        expect(defcount).toEqual(3);
    });

    test('Roll correct number of white defense dice', () => {
        let defcount = 0;
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            expect(color).toEqual(T.DieColor.White);
            defcount++;
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        diceRoller.simulateAttacks(1, atkInput);

        expect(defcount).toEqual(3);
    });

    test('Validate blocks and wounds', () => {
        let defcount = 0;
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            if(defcount < 3)
            {
                defcount++;
                return T.DefenseDieResult.Block;
            }
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 7;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.blocks).toEqual(3);
        expect(result.firstAttack.defense.wounds).toEqual(4);
    });

    test('Validate defensive surge', () => {
        let defcount = 0;
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            if(defcount < 2)
            {
                defcount++;
                return T.DefenseDieResult.Surge;
            }
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 9;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.surges).toEqual(2);
        expect(result.firstAttack.defense.wounds).toEqual(7);
    });

    test('Validate critical attacks', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            if(atkcount < 4) {
                atkcount++;
                return T.AttackDieResult.Miss;
            }
            return T.AttackDieResult.Critical;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 9;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.criticals).toEqual(5);
    });

    test('Validate attack surge to hit', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            if(atkcount < 2) {
                atkcount++;
                return T.AttackDieResult.Surge;
            }
            return T.AttackDieResult.Miss;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.surge = T.AttackSurgeConversion.Hit;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.surges).toEqual(2);
        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('Validate attack surge to crit', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            if(atkcount < 3) {
                atkcount++;
                return T.AttackDieResult.Surge;
            }
            return T.AttackDieResult.Miss;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.surge = T.AttackSurgeConversion.Critical;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.surges).toEqual(3);
        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
    });

    test('Validate light cover', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 2;
        atkInput.defense.cover = T.Cover.Light;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(2);
        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
    });

    test('Validate heavy cover', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 2;
        atkInput.defense.cover = T.Cover.Heavy;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(2);
        expect(result.firstAttack.defense.forcedSaves).toEqual(0);
    });

    test('Validate critical over cover', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.defense.cover = T.Cover.Heavy;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.criticals).toEqual(3);
        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
    });

    test('Validate critical x', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.offense.criticalX.active = true;
        atkInput.offense.criticalX.value = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.criticals).toEqual(0);
        expect(result.firstAttack.attack.surges).toEqual(3);
        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('Validate hits on armor', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.defense.armor = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(3);
        expect(result.firstAttack.defense.forcedSaves).toEqual(0);
    });

    test('Validate criticals on armor', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.defense.armor = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.criticals).toEqual(3);
        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
    });

    test('Validate hits on armor x', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.armorX.active = true;
        atkInput.defense.armorX.value = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(4);
        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('Validate crits on armor x', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.defense.armorX.active = true;
        atkInput.defense.armorX.value = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.criticals).toEqual(3);
        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
    });

    test('Validate impact on armor', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.impactX.active = true;
        atkInput.offense.impactX.value = 3;
        atkInput.defense.armor = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(5);
        expect(result.firstAttack.attack.criticals).toEqual(0);
        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
    });

    test('Validate impact on armor x', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 2;
        atkInput.offense.impactX.active = true;
        atkInput.offense.impactX.value = 1;
        atkInput.defense.armorX.active = true;
        atkInput.defense.armorX.value = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(2);
        expect(result.firstAttack.attack.criticals).toEqual(0);
        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
    });

    test('Validate pierce', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(4);
        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.blocks).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(2);
    });

    test('Validate impervious', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 2;
        atkInput.defense.impervious = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(4);
        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.blocks).toEqual(6);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate sharpshooter 1 on light', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.sharpshooterX.active = true;
        atkInput.offense.sharpshooterX.value = 1;
        atkInput.defense.cover = T.Cover.Light;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(4);
        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
    });
    test('Validate sharpshooter 1 on heavy', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.offense.sharpshooterX.active = true;
        atkInput.offense.sharpshooterX.value = 1;
        atkInput.defense.cover = T.Cover.Heavy;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(3);
        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('Validate sharpshooter 2 on heavy', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.sharpshooterX.active = true;
        atkInput.offense.sharpshooterX.value = 2;
        atkInput.defense.cover = T.Cover.Heavy;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(5);
        expect(result.firstAttack.defense.forcedSaves).toEqual(5);
    });
    test('Validate low profile', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.cover = T.Cover.Light;
        atkInput.defense.lowProfile = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(4);
        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('Validate uncanny luck', () => {
        let defcount = 0;

        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            defcount++;
            if(defcount < 7) {
                return T.DefenseDieResult.Blank;
            } else if(defcount < 8) {
                return T.DefenseDieResult.Block;
            } else {
                return T.DefenseDieResult.Surge;
            }
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 6;
        atkInput.defense.uncannyLuckX.active = true;
        atkInput.defense.uncannyLuckX.value = 4;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(defcount).toEqual(10);
        expect(result.firstAttack.defense.blocks).toEqual(1);
        expect(result.firstAttack.defense.surges).toEqual(3);
    });

    test('Validate suppression on no cover', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 2;
        atkInput.defense.tokens.suppression = 1;
        atkInput.defense.cover = T.Cover.None;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
    });

    test('Validate suppression on light cover', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.tokens.suppression = 3;
        atkInput.defense.cover = T.Cover.Light;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('Validate suppression on heavy cover', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.defense.tokens.suppression = 2;
        atkInput.defense.cover = T.Cover.Heavy;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
    });

    test('Validate danger sense with no suppression', () => {
        let defcount = 0;

        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            defcount++;
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.dangerSenseX.active = true;
        atkInput.defense.dangerSenseX.value = 4;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(defcount).toEqual(4);
    });

    test('Validate danger sense with less suppression', () => {
        let defcount = 0;

        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            defcount++;
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.defense.dangerSenseX.active = true;
        atkInput.defense.dangerSenseX.value = 4;
        atkInput.defense.tokens.suppression = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(defcount).toEqual(6);
    });

    test('Validate danger sense with more suppression', () => {
        let defcount = 0;

        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            defcount++;
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 2;
        atkInput.defense.dangerSenseX.active = true;
        atkInput.defense.dangerSenseX.value = 3;
        atkInput.defense.tokens.suppression = 5;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
        expect(defcount).toEqual(4);
    });

    test('Validate convert no defensive surge tokens', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.defense.surge = false;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
        expect(result.firstAttack.defense.wounds).toEqual(3);
    });

    test('Validate convert all defensive surge tokens', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.defense.surge = false;
        atkInput.defense.tokens.surge = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(5);
        expect(result.firstAttack.defense.wounds).toEqual(3);
    });

    test('Validate convert some defensive surge tokens', () => {
        let defcount = 0;

        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            if(defcount < 2) {
                defcount++;
                return T.DefenseDieResult.Surge;
            }
            return T.DefenseDieResult.Blank;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.tokens.surge = 7;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.surges).toEqual(2);
        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(2);
    });

    test('Validate convert no offensive surge tokens', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(0);
    });

    test('Validate convert all offensive surge tokens', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 6;
        atkInput.offense.tokens.surge = 4;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
    });

    test('Validate convert some offensive surge tokens', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            if(atkcount < 2) {
                atkcount++;
                return T.AttackDieResult.Surge;
            }
            return T.AttackDieResult.Miss;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.tokens.surge = 7;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('Validate dodge tokens', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.defense.tokens.dodge = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
    });

    test('Validate dodge tokens not affecting crits', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.defense.tokens.dodge = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
    });

    test('Validate outmaneuver', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            if(atkcount < 2) {
                atkcount++;
                return T.AttackDieResult.Critical;
            }
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.tokens.dodge = 3;
        atkInput.defense.outmaneuver = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
    });

    test('Validate high velocity', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 2;
        atkInput.offense.highVelocity = true;
        atkInput.defense.tokens.dodge = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('Validate shields', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            if(atkcount < 2) {
                atkcount++;
                return T.AttackDieResult.Critical;
            }
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.tokens.shield = 4;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(0);
    });

    test('Validate ion', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 2;
        atkInput.offense.ionX.active = true;
        atkInput.offense.ionX.value = 1;
        atkInput.defense.tokens.shield = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
    });

    test('Validate block', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.block = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate block with crits', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.block = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate block with no dodge', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.block = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(4);
    });

    test('Validate block with high velocity', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.highVelocity = true;
        atkInput.defense.surge = false;
        atkInput.defense.block = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(4);
    });

    test('Validate deflect', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.deflect = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate deflect with crits', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.deflect = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate deflect with no dodge', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.deflect = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(4);
    });

    test('Validate deflect with high velocity', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.highVelocity = true;
        atkInput.defense.surge = false;
        atkInput.defense.deflect = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(4);
    });

    test('Validate soresu mastery', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.soresuMastery = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate soresu mastery with crits', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.soresuMastery = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate soresu mastery with no dodge', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.soresuMastery = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(4);
    });

    test('Validate soresu mastery with high velocity', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.highVelocity = true;
        atkInput.defense.surge = false;
        atkInput.defense.soresuMastery = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(4);
    });

    test('Validate djem so mastery', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.djemSoMastery = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate djem so mastery with crits', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.djemSoMastery = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate djem so mastery with no dodge', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.defense.surge = false;
        atkInput.defense.djemSoMastery = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(4);
    });

    test('Validate djem so mastery with high velocity', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.highVelocity = true;
        atkInput.defense.surge = false;
        atkInput.defense.djemSoMastery = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(4);
    });

    test ('Validate observation tokens', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            atkcount++;
            return T.AttackDieResult.Miss;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.defense.tokens.observation = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(atkcount).toEqual(5);
    })

    test ('Validate aim tokens', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            atkcount++;
            return T.AttackDieResult.Miss;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.tokens.aim = 3;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(atkcount).toEqual(10);
    })

    test ('Validate precise keyword', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            atkcount++;
            return T.AttackDieResult.Miss;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 7;
        atkInput.offense.tokens.aim = 2;
        atkInput.offense.preciseX.active = true;
        atkInput.offense.preciseX.value = 3;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(atkcount).toEqual(17);
    })

    test ('Validate blast', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.offense.blast = true;
        atkInput.defense.cover = T.Cover.Heavy;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
    })

    test ('Validate immune: blast', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 3;
        atkInput.offense.blast = true;
        atkInput.defense.cover = T.Cover.Heavy;
        atkInput.defense.immuneBlast = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
    })

    test('Validate immune: pierce', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 2;
        atkInput.defense.immunePierce = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(4);
        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.blocks).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate lethal', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            atkcount++;
            return atkcount < 2 ? T.AttackDieResult.Hit : T.AttackDieResult.Miss;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 4;
        atkInput.offense.lethalX.active = true;
        atkInput.offense.lethalX.value = 1;
        atkInput.offense.tokens.aim = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.hits).toEqual(1);
        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
        expect(result.firstAttack.defense.blocks).toEqual(1);
        expect(result.firstAttack.defense.wounds).toEqual(1);
    });

    test('Validate lethal, nothing to convert', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            atkcount++;
            return T.AttackDieResult.Miss;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.defense.cover = T.Cover.Heavy;
        atkInput.offense.redDice = 4;
        atkInput.offense.lethalX.active = true;
        atkInput.offense.lethalX.value = 1;
        atkInput.offense.tokens.aim = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(atkcount).toEqual(6);
        expect(result.firstAttack.attack.hits).toEqual(0);
        expect(result.firstAttack.defense.forcedSaves).toEqual(0);
        expect(result.firstAttack.defense.blocks).toEqual(0);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('Validate lethal, reroll then convert', () => {
        let atkcount = 0;
        diceRoller.rollAttackDie = (color) => {
            atkcount++;
            if(atkcount <= 4) {
                return T.AttackDieResult.Miss;
            }
            return T.AttackDieResult.Hit;
        }
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.defense.cover = T.Cover.Light;
        atkInput.offense.redDice = 4;
        atkInput.offense.lethalX.active = true;
        atkInput.offense.lethalX.value = 1;
        atkInput.offense.tokens.aim = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(atkcount).toEqual(6);
        expect(result.firstAttack.attack.hits).toEqual(2);
        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
        expect(result.firstAttack.defense.blocks).toEqual(1);
        expect(result.firstAttack.defense.wounds).toEqual(1);
    });

    test('Validate jedi hunter without force user', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.surge = T.AttackSurgeConversion.Blank;
        atkInput.offense.jediHunter = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.surges).toEqual(5);
        expect(result.firstAttack.defense.forcedSaves).toEqual(0);
    });

    test('Validate jedi hunter with force user', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Surge;
        }

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.surge = T.AttackSurgeConversion.Blank;
        atkInput.offense.jediHunter = true;
        atkInput.defense.hasForceUpgrades = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.surges).toEqual(5);
        expect(result.firstAttack.defense.forcedSaves).toEqual(5);
    });

    test('Validate guardian', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.combat.guardian.active = true;
        atkInput.combat.guardian.value = 3;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(1);
    });

    test('Validate guardian agains crits', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Critical;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Blank;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.combat.guardian.active = true;
        atkInput.combat.guardian.value = 3;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
    });

    test('validate duelist (offensive)', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.duelist = true;
        atkInput.offense.tokens.aim = 1;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(1);
    });

    test('validate duelist (offensive), with reroll', () => {
        let atkCount = 0;
        diceRoller.rollAttackDie = (color) => {
            atkCount++;
            if(atkCount <= 2) {
                return T.AttackDieResult.Hit;
            }
            return T.AttackDieResult.Miss;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.duelist = true;
        atkInput.offense.tokens.aim = 1;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
        expect(result.firstAttack.defense.wounds).toEqual(1);
    });

    test('validate duelist (offensive), no aim', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.duelist = true;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('validate duelist (offensive), immune pierce', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.duelist = true;
        atkInput.offense.tokens.aim = 1;
        atkInput.defense.immunePierce = true;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('validate duelist (offensive), range attack', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.duelist = true;
        atkInput.offense.tokens.aim = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('validate duelist (defensive)', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 1;
        atkInput.defense.duelist = true;
        atkInput.defense.tokens.dodge = 1;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
        expect(result.firstAttack.defense.wounds).toEqual(0);
    });

    test('validate duelist (defensive), no dodge', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 1;
        atkInput.defense.duelist = true;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(4);
        expect(result.firstAttack.defense.wounds).toEqual(1);
    });

    test('validate duelist (defensive), range attack', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 1;
        atkInput.defense.duelist = true;
        atkInput.defense.tokens.dodge = 1;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(3);
        expect(result.firstAttack.defense.wounds).toEqual(1);
    });

    test('validate ram in melee', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Miss;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.whiteDice = 2;
        atkInput.offense.ramX.active = true;
        atkInput.offense.ramX.value = 2;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.attack.criticals).toEqual(0);
        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('validate ram at range', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Miss;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 4;
        atkInput.offense.whiteDice = 2;
        atkInput.offense.ramX.active = true;
        atkInput.offense.ramX.value = 2;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(0);
    });

    test('validate ram converts hits', () => {
        diceRoller.rollAttackDie = (color) => {
            return color === T.DieColor.Black ? T.AttackDieResult.Hit : T.AttackDieResult.Miss;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.blackDice = 1;
        atkInput.offense.whiteDice = 1;
        atkInput.offense.ramX.active = true;
        atkInput.offense.ramX.value = 2;
        atkInput.defense.tokens.dodge = 2;  // use dodge tokens to make sure hits are converted
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.forcedSaves).toEqual(2);
    });

    test('validate makashi mastery against no counter', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.makashiMastery = true;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 2;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.wounds).toEqual(2);
    });

    test('validate makashi mastery against immune: pierce', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.makashiMastery = true;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 2;
        atkInput.defense.immunePierce = true;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.wounds).toEqual(1);
    });

    test('validate makashi mastery against impervious', () => {
        let defCount = 0;
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            defCount++;
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.makashiMastery = true;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 2;
        atkInput.defense.impervious = true;
        atkInput.combat.meleeAttack = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(defCount).toEqual(5);
        expect(result.firstAttack.defense.wounds).toEqual(1);
    });

    test('validate makashi mastery against immune: pierce at range', () => {
        diceRoller.rollAttackDie = (color) => {
            return T.AttackDieResult.Hit;
        };
        diceRoller.rollDefenseDie = (color) => {
            return T.DefenseDieResult.Block;
        };

        const atkInput = T.createDefaultAttackInput();
        atkInput.offense.redDice = 5;
        atkInput.offense.makashiMastery = true;
        atkInput.offense.pierceX.active = true;
        atkInput.offense.pierceX.value = 2;
        atkInput.defense.immunePierce = true;
        const result = diceRoller.simulateAttacks(1, atkInput);

        expect(result.firstAttack.defense.wounds).toEqual(0);
    });
});
