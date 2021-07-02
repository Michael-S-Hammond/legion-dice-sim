import * as AIA from '../../../code/profiles/AttackInputsApplicator';
import * as T from '../../../code/Types';
import * as UC from '../../../code/profiles/UpgradeCard';
import * as UP from '../../../code/profiles/UnitProfile';

describe('AttackInputApplicator', () => {
    const defaultTokens: T.OffenseTokens = {
        aim: 0,
        surge: 0
    };

    function testOffenseAndCombatSnapshots(input: T.AttackInput, prefix: string) {
        expect(input.offense).toMatchSnapshot(prefix + ' Offense');
        expect(input.combat).toMatchSnapshot(prefix +' Combat');
    }

    it('applies a commander unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Emperor Palpatine')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[0]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'Emperor Palpatine - Default');
    });

    it('applies a heavy unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'X-34 Landspeeder')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[0]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'X-34 Landspeeder - Default');
    });

    it('applies an operative unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Cad Bane')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[1]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'Cad Bane - Default');
    });

    it('applies a special forces unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'ARC Troopers')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[0]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'ARC Troopers - Default');
    });

    it('applies a support unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Droidekas')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[0]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'Droidekas - Default');
    });

    it('applies a trooper unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Rebel Troopers')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[0]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'Rebel Troopers - Default');
    });
});
