import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as UP from '../../../code/profiles/UnitProfile';

import FactionButtonGroup from '../../../components/profiles/FactionButtonGroup';

describe('FactionButtonGroup', () => {
    it('matches the snapshot', () => {
        const onFactionChange = jest.fn();
        const faction = UP.Faction.rebel;

        const group = shallow(<FactionButtonGroup
                faction={faction}
                onFactionChange={onFactionChange}
            ></FactionButtonGroup>);
        const snapshot = shallowToJson(group);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles being clicked', () => {
        let faction = UP.Faction.rebel;
        const onFactionChange = jest.fn((newFaction) => {
            faction = newFaction;
        });

        const wrapper = shallow(<FactionButtonGroup
            faction={faction}
            onFactionChange={onFactionChange}
        ></FactionButtonGroup>);
        wrapper.find('#' + UP.Faction.separatist).simulate('change', { target: { value: String(UP.Faction.separatist) }});

        expect(onFactionChange).toHaveBeenCalledTimes(1);
        expect(faction).toEqual(UP.Faction.separatist);
    })
});
