import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as T from '../../code/Types';
import AttackTokens from '../../components/AttackTokens';

import * as EventMocks from '../mocks/EventHandlerMocks';

describe('AttackTokens', () => {
    it('matches the snapshot', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateAttackEventHandlers();

        const attackTokens = shallow(<AttackTokens
            tokens={input.offense.tokens}
            eventHandlers={events}
            ></AttackTokens>);

        const snapshot = shallowToJson(attackTokens);
        expect(snapshot).toMatchSnapshot();
    });
});
