import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as T from '../../code/Types';
import DefenseTokens from '../../components/DefenseTokens';

import * as EventMocks from '../mocks/EventHandlerMocks';

describe('DefenseTokens', () => {
    it('matches the snapshot', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateDefenseEventHandlers();

        const defenseAbilities = shallow(<DefenseTokens
            showSimplifiedView={false}
            tokens={input.defense.tokens}
            eventHandlers={events}
            ></DefenseTokens>);

        const snapshot = shallowToJson(defenseAbilities);
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot for simplified view', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateDefenseEventHandlers();

        const defenseAbilities = shallow(<DefenseTokens
            showSimplifiedView={true}
            tokens={input.defense.tokens}
            eventHandlers={events}
            ></DefenseTokens>);

        const snapshot = shallowToJson(defenseAbilities);
        expect(snapshot).toMatchSnapshot();
    });
});
