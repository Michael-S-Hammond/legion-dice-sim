import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as T from '../../code/Types';
import Combat from '../../components/Combat';

import * as EventMocks from '../mocks/EventHandlerMocks';

describe('Combat', () => {
    it('matches the snapshot', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateCombatEventHandlers();

        const combat = shallow(<Combat
            input={input.combat}
            eventHandlers={events}
            ></Combat>);
        const snapshot = shallowToJson(combat);
        expect(snapshot).toMatchSnapshot();
    });
});
