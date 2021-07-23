import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as AL from '../../../code/profiles/AllowList';
import * as UC from '../../../code/profiles/UpgradeCard';
import * as UP from '../../../code/profiles/UnitProfile';

import ProfileSelectorDialog from 'components/profiles/ProfileSelectorDialog';

describe('ProfileSelectorDialog', () => {
    it('attack profile matches the snapshot', () => {
        const onApplyProfile = jest.fn();

        const dialog = shallow(<ProfileSelectorDialog
                id="attackProfileSelector"
                applyProfile={onApplyProfile}
                upgradeAllowListName={AL.AllowListName.attack}
            ></ProfileSelectorDialog>);
        const snapshot = shallowToJson(dialog);
        expect(snapshot).toMatchSnapshot();
    });

    it('defense profile matches the snapshot', () => {
        const onApplyProfile = jest.fn();

        const dialog = shallow(<ProfileSelectorDialog
                id="defenseProfileSelector"
                applyProfile={onApplyProfile}
                upgradeAllowListName={AL.AllowListName.defense}
            ></ProfileSelectorDialog>);
        const snapshot = shallowToJson(dialog);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles faction change', () => {
        let trackedProfile = UP.getUnits()[0];
        let trackedWeapons: Array<UP.Weapon> = [];
        let trackedUpgrades: Array<UC.Upgrade> = [];

        function onApplyProfile(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>) {
            trackedProfile = profile;
            trackedWeapons = weapons;
            trackedUpgrades = upgrades;
        }

        render(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        expect(screen.getByDisplayValue('rebel')).toBeChecked();

        userEvent.click(screen.getByTitle('Empire'));
        expect(screen.getByDisplayValue('rebel')).not.toBeChecked();
        expect(screen.getByDisplayValue('empire')).toBeChecked();

        userEvent.click(screen.getByText('Apply'));
        const target = UP.getUnits().filter(u => u.faction === UP.Faction.empire && u.rank === UP.Rank.commander)[0];
        expect(trackedProfile).toEqual(target);
    });

    it('handles rank change', () => {
        let trackedProfile = UP.getUnits()[0];
        let trackedWeapons: Array<UP.Weapon> = [];
        let trackedUpgrades: Array<UC.Upgrade> = [];

        function onApplyProfile(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>) {
            trackedProfile = profile;
            trackedWeapons = weapons;
            trackedUpgrades = upgrades;
        }

        render(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        expect(screen.getByDisplayValue('commander')).toBeChecked();

        userEvent.click(screen.getByTitle('Operative'));
        expect(screen.getByDisplayValue('commander')).not.toBeChecked();
        expect(screen.getByDisplayValue('operative')).toBeChecked();

        userEvent.click(screen.getByText('Apply'));
        const target = UP.getUnits().filter(u => u.faction === UP.Faction.rebel && u.rank === UP.Rank.operative)[0];
        expect(trackedProfile).toEqual(target);
    });

    it('handles unit change', () => {
        let trackedProfile = UP.getUnits()[0];
        let trackedWeapons: Array<UP.Weapon> = [];
        let trackedUpgrades: Array<UC.Upgrade> = [];

        function onApplyProfile(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>) {
            trackedProfile = profile;
            trackedWeapons = weapons;
            trackedUpgrades = upgrades;
        }

        render(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        const target = UP.getUnits().filter(u => u.faction === UP.Faction.rebel && u.rank === UP.Rank.commander)[2];
        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Unit name', hidden: true }),
            [target.name]);
        userEvent.click(screen.getByText('Apply'));
        expect(trackedProfile).toEqual(target);
    });

    it('handles weapon change', () => {
        let trackedProfile = UP.getUnits()[0];
        let trackedWeapons: Array<UP.Weapon> = [];
        let trackedUpgrades: Array<UC.Upgrade> = [];

        function onApplyProfile(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>) {
            trackedProfile = profile;
            trackedWeapons = weapons;
            trackedUpgrades = upgrades;
        }

        render(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        const target = UP.getUnits().filter(u => u.faction === UP.Faction.rebel && u.rank === UP.Rank.commander)[0];
        const weapons = [target.weapons[1]];

        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Weapon 0', hidden: true }),
            [weapons[0].name]);
        userEvent.click(screen.getByText('Apply'));
        expect(trackedProfile).toEqual(target);
        expect(trackedWeapons).toEqual(weapons);
    });

    it('handles weapon change with multiple weapons', () => {
        let trackedProfile = UP.getUnits()[0];
        let trackedWeapons: Array<UP.Weapon> = [];
        let trackedUpgrades: Array<UC.Upgrade> = [];

        function onApplyProfile(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>) {
            trackedProfile = profile;
            trackedWeapons = weapons;
            trackedUpgrades = upgrades;
        }

        render(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        userEvent.click(screen.getByTitle('Empire'));
        userEvent.click(screen.getByTitle('Operative'));
        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Unit name', hidden: true }),
            ['Boba Fett']);

        const target = UP.getUnits().filter(u => u.name === 'Boba Fett')[0];
        const weapons = [target.weapons[1], target.weapons[2]];

        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Weapon 0', hidden: true }),
            [weapons[0].name]);
        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Weapon 1', hidden: true }),
            [weapons[1].name]);

        userEvent.click(screen.getByText('Apply'));
        expect(trackedProfile).toEqual(target);
        expect(trackedWeapons).toEqual(weapons);
    });

    it('handles weapon change to clear value', () => {
        let trackedProfile = UP.getUnits()[0];
        let trackedWeapons: Array<UP.Weapon> = [];
        let trackedUpgrades: Array<UC.Upgrade> = [];

        function onApplyProfile(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>) {
            trackedProfile = profile;
            trackedWeapons = weapons;
            trackedUpgrades = upgrades;
        }

        render(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        const target = UP.getUnits().filter(u => u.faction === UP.Faction.rebel && u.rank === UP.Rank.commander)[0];
        const offsetWeapon = target.weapons[0];

        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Weapon 0', hidden: true }),
            [offsetWeapon.name]);
        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Weapon 0', hidden: true }),
            ['']);

        userEvent.click(screen.getByText('Apply'));
        expect(trackedProfile).toEqual(target);
        expect(trackedWeapons).toEqual([]);
    });

    it('handles upgrade change', () => {
        let trackedProfile = UP.getUnits()[0];
        let trackedWeapons: Array<UP.Weapon> = [];
        let trackedUpgrades: Array<UC.Upgrade> = [];

        function onApplyProfile(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>) {
            trackedProfile = profile;
            trackedWeapons = weapons;
            trackedUpgrades = upgrades;
        }

        render(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        const target = UP.getUnits().filter(u => u.name === 'Cassian Andor')[0];
        const upgrade = UC.getUpgrades().filter(u => u.name === 'A280-CFE Sniper Config')[0];

        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Unit name', hidden: true }),
            [target.name]);
        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Upgrade 1', hidden: true }),
            [upgrade.name]);
        
        userEvent.click(screen.getByText('Apply'));
        expect(trackedProfile).toEqual(target);
        expect(trackedUpgrades).toEqual([undefined, upgrade]);
    });

    it('handles multiple upgrades', () => {
        let trackedProfile = UP.getUnits()[0];
        let trackedWeapons: Array<UP.Weapon> = [];
        let trackedUpgrades: Array<UC.Upgrade> = [];

        function onApplyProfile(profile: UP.UnitProfile, weapons: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>) {
            trackedProfile = profile;
            trackedWeapons = weapons;
            trackedUpgrades = upgrades;
        }

        render(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        userEvent.click(screen.getByTitle('Republic'));
        userEvent.click(screen.getByTitle('Special Forces'));
        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Unit name', hidden: true }),
            ['ARC Troopers']);
        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Unit subtitle', hidden: true }),
            ['Strike Team']);

        const target = UP.getUnits().filter(u => u.name === 'ARC Troopers' && u.subtitle === 'Strike Team')[0];
        const upgrade1 = UC.getUpgrades().filter(u => u.name === 'DC-15x ARC Trooper')[0];
        const upgrade2 = UC.getUpgrades().filter(u => u.name === 'Targeting Scopes')[0];

        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Upgrade 0', hidden: true }),
            [upgrade1.name]);
        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'Upgrade 1', hidden: true }),
            [upgrade2.name]);

        userEvent.click(screen.getByText('Apply'));
        expect(trackedProfile).toEqual(target);
        expect(trackedUpgrades).toEqual([upgrade1, upgrade2]);
    });
});
