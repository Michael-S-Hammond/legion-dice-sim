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

    it('applies blast upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Rebel Troopers')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'Concussion Grenades');

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[1]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'Rebel Troopers - Concussion Grenades')
    });

    it('handles high velocity upgrade with high velocity on default weapon', () => {
        const profile = UP.getUnits().filter(u => u.name === 'AAT Trade Federation Battle Tank')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'High-Energy Shells');

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[1]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'AAT Trade Federation Battle Tank - High-Energy Shells');
    });

    it('handles high velocity upgrade without high velocity on default weapon', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Scout Troopers' && u.subtitle === 'Strike Team')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'DLT-19x Sniper');

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[1]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'Scout Troopers: Strike Team - DLT-19x Sniper');
    });

    it('handles non-high velocity upgrade with high velocity on default weapon', () => {
        const profile = UP.getUnits().filter(u => u.name === 'AAT Trade Federation Battle Tank')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === '\"Bunker Buster\" Shells');

        const input = AIA.createAttackInputsFromProfile(profile, [profile.weapons[1]], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'AAT Trade Federation Battle Tank - \"Bunker Buster\" Shells');
    });

    it('handles high velocity upgrade without default weapon', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Scout Troopers' && u.subtitle === 'Strike Team')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'DLT-19x Sniper');

        const input = AIA.createAttackInputsFromProfile(profile, [], upgrades, defaultTokens);
        testOffenseAndCombatSnapshots(input, 'Scout Troopers: Strike Team (no weapon) - DLT-19x Sniper');
    });
});
