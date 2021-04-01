import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as T from '../../code/Types';
import AttackAbilities from '../../components/AttackAbilities';

import * as EventMocks from '../mocks/EventHandlerMocks';

describe('AttackAbilities', () => {
    it('matches the snapshot', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateAttackEventHandlers();

        const attackAbilities = shallow(<AttackAbilities
            showSimpleView={false}
            input={input.offense}
            eventHandlers={events}
            ></AttackAbilities>);

        const snapshot = shallowToJson(attackAbilities);
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot for simplified view', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateAttackEventHandlers();

        const attackAbilities = shallow(<AttackAbilities
            showSimpleView={true}
            input={input.offense}
            eventHandlers={events}
            ></AttackAbilities>);

        const snapshot = shallowToJson(attackAbilities);
        expect(snapshot).toMatchSnapshot();
    });
});
