import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

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
        function onFactionChange(newFaction: UP.Faction) {
            faction = newFaction;
        }

        render(<FactionButtonGroup
                faction={faction}
                onFactionChange={onFactionChange}
            ></FactionButtonGroup>);

        userEvent.click(screen.getByTitle('Separatist'));
        expect(faction).toEqual(UP.Faction.separatist);
    })
});
