import React from 'react';

import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as AL from '../../../code/profiles/AllowList';
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
});
