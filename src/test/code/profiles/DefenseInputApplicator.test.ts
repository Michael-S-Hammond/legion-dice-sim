import * as DIA from '../../../code/profiles/DefenseInputsApplicator';
import * as T from '../../../code/Types';
import * as UC from '../../../code/profiles/UpgradeCard';
import * as UP from '../../../code/profiles/UnitProfile';

describe('UnitProfile', () => {
    const defaultTokens: T.DefenseTokens = {
        dodge: 0,
        observation: 0,
        shield: 0,
        suppression: 0,
        surge: 0
    };

    it('applies a commander unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Emperor Palpatine')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Emperor Palpatine");
    });

    it('applies a heavy unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'X-34 Landspeeder')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("X-34 Landspeeder");
    });

    it('applies an operative unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Cad Bane')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Cad Bane");
    });

    it('applies a special forces unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'ARC Troopers')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("ARC Troopers");
    });

    it('applies a support unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Droidekas')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Droidekas");
    });

    it('applies a trooper unit', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Rebel Troopers')[0];
        const upgrades: Array<UC.Upgrade> = [];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Rebel Troopers");
    });

    it('applies armor upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === '74-Z Speeder Bikes')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.hardpoint,
            name: "Hardened Plating",
            points: 25,
            keywords: {
                armor: true
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("74-Z Speeder Bikes + armor upgrade");
    });

    it('applies armor X upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Wookiee Warriors' && u.faction === UP.Faction.rebel)[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'Battle Shield Wookiee (Defensive)');

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Wookie Warriors + Battle Shield Wookiee (Defensive)");
    });

    it('applies block upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Wookiee Warriors' && u.faction === UP.Faction.rebel)[0];
        const upgrades = [{
            type: UP.UnitUpgrade.training,
            name: "Defensive Training",
            points: 12,
            keywords: {
                block: true
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Wookie Warriors + block upgrade");
    });

    it('applies cover upgrade (none to light)', () => {
        const profile = UP.getUnits().filter(u => u.name === 'A-A5 Speeder Truck')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'Outer Rim Speeder Jockey');

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("A-A5 Speeder Truck + Outer Rim Speeder Jockey");
    });

    it('applies cover upgrade (light to heavy)', () => {
        const profile = UP.getUnits().filter(u => u.name === 'T-47 Airspeeder')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'Outer Rim Speeder Jockey');

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("T-47 Airspeeder + Outer Rim Speeder Jockey");
    });

    it('handles cover upgrade (heavy + upgrade)', () => {
        const profile = {
            faction: UP.Faction.rebel,
            name: "Modified T-47 Airspeeder",
            rank: UP.Rank.heavy,
            miniCount: 1,
            points: 130,
            unitType: UP.UnitType.repulsorVehicle,
            defenseDie: T.DieColor.White,
            wounds: 7,
            resilience: 5,
            attackSurge: UP.AttackSurge.critical,
            defenseSurge: false,
            speed: 3,
            upgrades: [UP.UnitUpgrade.pilot],
            weapons: [],
            keywords: {
                armor: true,
                cover: T.Cover.Heavy,
                immune: [UP.UnitImmune.blast, UP.UnitImmune.melee, UP.UnitImmune.range1Weapons],
                speeder: 2
            }
        };
        const upgrades = UC.getUpgrades().filter(u => u.name === 'Outer Rim Speeder Jockey');

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("cover upgrade (heavy +  Outer Rim Speeder Jockey)");
    });

    it('applies cover upgrade (heavy upgrade)', () => {
        const profile = UP.getUnits().filter(u => u.name === 'T-47 Airspeeder')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.pilot,
            name: "Outer Rim Speeder Ace",
            points: 20,
            restrictions: [{
                faction: UP.Faction.rebel,
                type: UP.UnitType.repulsorVehicle
            }],
            keywords: {
                cover: T.Cover.Heavy
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("T-47 Airspeeder + heavy cover upgrade");
    });

    it('applies deflect upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'General Grievous')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.training,
            name: "Force Insight",
            points: 20,
            keywords: {
                deflect: true
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("General Grievous + deflect upgrade");
    });

    it('applies djem so mastery upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'General Grievous')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.training,
            name: "Anakin Apprenticeship",
            points: 20,
            keywords: {
                djemSoMastery: true
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("General Grievous + djem so mastery upgrade");
    });

    it('applies duelist upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Mandalorian Resistance')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'Beskad Duelist');

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Mandalorian Resistance + Beskad Duelist");
    });

    it('applies immune: blast upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Phase I Clone Troopers')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.gear,
            name: "Portable Bunker",
            points: 20,
            keywords: {
                immune: [UP.UnitImmune.blast]
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Phase I Clone Troopers + immune: blast upgrade");
    });

    it('applies immune: pierce upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Han Solo')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.gear,
            name: "Dumb Luck",
            points: 20,
            keywords: {
                immune: [UP.UnitImmune.pierce]
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Han Solo + immune: pierce upgrade");
    });

    it('applies impervious upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Padmé Amidala')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.gear,
            name: "Beskar Armor",
            points: 20,
            keywords: {
                impervious: true
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Padmé Amidala + impervious upgrade");
    });

    it('applies low profile upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Agent Kallus')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.training,
            name: "Nap Time",
            points: 10,
            keywords: {
                lowProfile: true
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Agent Kallus + low profile upgrade");
    });

    it('applies outmaneuver upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Phase II Clone Troopers')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'Situational Awareness');

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Phase II Clone Troopers + Situational Awareness");
    });

    it('applies shielded upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Sabine Wren')[0];
        const upgrades = UC.getUpgrades().filter(u => u.name === 'Personal Combat Shield');

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Sabine Wren + Personal Combat Shield");
    });

    it('applies soresu mastery upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'General Grievous')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.training,
            name: "Obi-Wan Apprenticeship",
            points: 20,
            keywords: {
                soresuMastery: true
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("General Grievous + soresu mastery upgrade");
    });

    it('adds value from upgrade', () => {
        const profile = UP.getUnits().filter(u => u.name === 'Han Solo')[0];
        const upgrades = [{
            type: UP.UnitUpgrade.gear,
            name: "Han's Dice",
            points: 10,
            keywords: {
                uncannyLuck: 1
            }
        }];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("Han Solo + uncanny luck upgrade");
    });

    it('handles no upgrade slots on profile', () => {
        const profile = {
            faction: UP.Faction.separatist,
            name: "Spare Parts",
            rank: UP.Rank.corps,
            miniCount: 1,
            points: 15,
            unitType: UP.UnitType.droidTrooper,
            defenseDie: T.DieColor.White,
            wounds: 1,
            attackSurge: UP.AttackSurge.blank,
            defenseSurge: false,
            speed: 0,
            weapons: [],
            keywords: {
                "stationary": true
            }
        };
        const upgrades: Array<UC.Upgrade> = [];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("unit with no upgrades");
    });

    it('handles no keywords on profile', () => {
        const profile = {
            faction: UP.Faction.rebel,
            name: "Bored Trooper",
            rank: UP.Rank.corps,
            miniCount: 1,
            points: 20,
            unitType: UP.UnitType.trooper,
            defenseDie: T.DieColor.White,
            wounds: 1,
            attackSurge: UP.AttackSurge.blank,
            defenseSurge: true,
            speed: 1,
            weapons: []
        };
        const upgrades: Array<UC.Upgrade> = [];

        const input = DIA.createDefenseInputsFromProfile(profile, upgrades, defaultTokens);
        expect(input.defense).toMatchSnapshot("unit with no keywords");
    });
});
