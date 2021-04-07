import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as T from '../../code/Types';
import Defense from '../../components/Defense';

import * as EventMocks from '../mocks/EventHandlerMocks';

describe('Defense', () => {
    it('matches the snapshot', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateDefenseEventHandlers();

        const defense = shallow(<Defense
            showSimpleView={false}
            input={input.defense}
            eventHandlers={events}
            ></Defense>);

        const snapshot = shallowToJson(defense);
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot for simplified view', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateDefenseEventHandlers();

        const defense = shallow(<Defense
            showSimpleView={true}
            input={input.defense}
            eventHandlers={events}
            ></Defense>);

        const snapshot = shallowToJson(defense);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles surge conversion changing', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateDefenseEventHandlers();

        const wrapper = shallow(<Defense
            showSimpleView={false}
            input={input.defense}
            eventHandlers={events}
            ></Defense>);
        wrapper.find('select').simulate('change', { target: { value: 3 } });

        expect(events.handleCoverChange).toHaveBeenCalledTimes(1);
        expect(events.handleCoverChange).toHaveBeenCalledWith(3);
    })
});
