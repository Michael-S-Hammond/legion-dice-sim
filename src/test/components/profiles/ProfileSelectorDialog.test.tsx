import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as AL from '../../../code/profiles/AllowList';

import ProfileSelectorDialog from 'components/profiles/ProfileSelectorDialog';

describe('ProfileSelectorDialog', () => {
    it('attack profile matches the snapshot', () => {
        const onApplyProfile = jest.fn();

        const dialog = shallow(<ProfileSelectorDialog
                id="attackProfileSelector"
                applyProfile={onApplyProfile}
                upgradeAllowListName={AL.AllowListName.attack}
            ></ProfileSelectorDialog>)
        const snapshot = shallowToJson(dialog);
        expect(snapshot).toMatchSnapshot();
    });

    it('defense profile matches the snapshot', () => {
        const onApplyProfile = jest.fn();

        const dialog = shallow(<ProfileSelectorDialog
                id="defenseProfileSelector"
                applyProfile={onApplyProfile}
                upgradeAllowListName={AL.AllowListName.defense}
            ></ProfileSelectorDialog>)
        const snapshot = shallowToJson(dialog);
        expect(snapshot).toMatchSnapshot();
    });
});

