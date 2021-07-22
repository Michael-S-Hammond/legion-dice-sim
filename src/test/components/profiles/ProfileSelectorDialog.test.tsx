import React from 'react';

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
        const onApplyProfile = jest.fn();

        const dialog = mount(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        dialog.find('#empire').simulate('change', { target: { value: String(UP.Faction.empire) }});

        expect(dialog.state('faction')).toEqual(String(UP.Faction.empire));
        expect(dialog.state('unit')).toEqual(UP.getUnits().filter(u =>
            u.faction === UP.Faction.empire && u.rank === UP.Rank.commander)[0]);
    });

    it('handles rank change', () => {
        const onApplyProfile = jest.fn();

        const dialog = mount(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        dialog.find('#operative').simulate('change', { target: { value: String(UP.Rank.operative) }});

        expect(dialog.state('rank')).toEqual(String(UP.Rank.operative));
        expect(dialog.state('unit')).toEqual(UP.getUnits().filter(u =>
            u.faction === UP.Faction.rebel && u.rank === UP.Rank.operative)[0]);
    });

    it('handles unit change', () => {
        const onApplyProfile = jest.fn();

        const dialog = mount(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        dialog.find('#attackProfileSelector-unit-nameSelect').simulate('change', { target: { value: String('Leia Organa') }});

        expect(dialog.state('unit')).toEqual(UP.getUnits().filter(u => u.name === 'Leia Organa')[0]);
    });

    it('handles weapon change', () => {
        const onApplyProfile = jest.fn();
        const unit = UP.getUnits().filter(u => u.faction === UP.Faction.rebel && u.rank === UP.Rank.commander)[0];

        const dialog = mount(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        dialog.find('#attackProfileSelector-weapon-0-itemSelect').simulate('change', { target: { value: unit.weapons[0].name }});
        expect(dialog.state('weapons')).toEqual([unit.weapons[0]]);
    });

    it('handles weapon change with multiple weapons', () => {
        const onApplyProfile = jest.fn();
        const unit = UP.getUnits().filter(u => u.name == 'Boba Fett')[0];

        const dialog = mount(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        dialog.find('#empire').simulate('change', { target: { value: String(UP.Faction.empire) }});
        dialog.find('#operative').simulate('change', { target: { value: String(UP.Rank.operative) }});
        dialog.find('#attackProfileSelector-unit-nameSelect').simulate('change', { target: { value: String('Boba Fett') }});
        dialog.find('#attackProfileSelector-weapon-0-itemSelect').simulate('change', { target: { value: unit.weapons[1].name }});
        dialog.find('#attackProfileSelector-weapon-1-itemSelect').simulate('change', { target: { value: unit.weapons[2].name }});

        expect(dialog.state('weapons')).toEqual([unit.weapons[1], unit.weapons[2]]);
    });

    it('handles weapon change to clear value', () => {
        const onApplyProfile = jest.fn();
        const unit = UP.getUnits().filter(u => u.name == 'Boba Fett')[0];

        const dialog = mount(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        dialog.find('#empire').simulate('change', { target: { value: String(UP.Faction.empire) }});
        dialog.find('#operative').simulate('change', { target: { value: String(UP.Rank.operative) }});
        dialog.find('#attackProfileSelector-unit-nameSelect').simulate('change', { target: { value: String('Boba Fett') }});
        dialog.find('#attackProfileSelector-weapon-0-itemSelect').simulate('change', { target: { value: unit.weapons[1].name }});
        dialog.find('#attackProfileSelector-weapon-1-itemSelect').simulate('change', { target: { value: unit.weapons[2].name }});
        dialog.find('#attackProfileSelector-weapon-0-itemSelect').simulate('change', { target: { value: '' }});

        expect(dialog.state('weapons')).toEqual([undefined, unit.weapons[2]]);
    });

    it('handles upgrade change', () => {
        const onApplyProfile = jest.fn();
        const upgrade = UC.getUpgrades().filter(u => u.name === 'A280-CFE Sniper Config')[0];

        const dialog = mount(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        dialog.find('#attackProfileSelector-1-upgrade-itemSelect').simulate('change', { target: { value: upgrade.name }});
        expect(dialog.state('upgrades')).toEqual([undefined, upgrade]);
    });

    it('handles multiple upgrades', () => {
        const onApplyProfile = jest.fn();
        const upgrade1 = UC.getUpgrades().filter(u => u.name === 'DC-15x ARC Trooper')[0];
        const upgrade2 = UC.getUpgrades().filter(u => u.name === 'Targeting Scopes')[0];

        const dialog = mount(<ProfileSelectorDialog
            id="attackProfileSelector"
            applyProfile={onApplyProfile}
            upgradeAllowListName={AL.AllowListName.attack}
        ></ProfileSelectorDialog>);

        dialog.find('#republic').simulate('change', { target: { value: String(UP.Faction.republic) }});
        dialog.find('#specialForces').simulate('change', { target: { value: String(UP.Rank.specialForces) }});
        dialog.find('#attackProfileSelector-unit-nameSelect').simulate('change', { target: { value: String('ARC Troopers') }});
        dialog.find('#attackProfileSelector-unit-subtitleSelect').simulate('change', { target: { value: String('Strike Team') }});
        dialog.find('#attackProfileSelector-0-upgrade-itemSelect').simulate('change', { target: { value: upgrade1.name }});
        dialog.find('#attackProfileSelector-1-upgrade-itemSelect').simulate('change', { target: { value: upgrade2.name }});

        expect(dialog.state('upgrades')).toEqual([upgrade1, upgrade2]);

        dialog.find('#attackProfileSelector-0-upgrade-itemSelect').simulate('change', { target: { value: '' }});

        expect(dialog.state('upgrades')).toEqual([undefined, upgrade2]);
    });
});
