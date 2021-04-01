import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as T from '../../code/Types';
import DefenseAbilities from '../../components/DefenseAbilities';

import * as EventMocks from '../mocks/EventHandlerMocks';

describe('DefenseAbilities', () => {
    it('matches the snapshot', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateDefenseEventHandlers();

        const defenseAbilities = shallow(<DefenseAbilities
            showSimpleView={false}
            inputs={input.defense}
            eventHandlers={events}
            ></DefenseAbilities>);

        const snapshot = shallowToJson(defenseAbilities);
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot for simplified view', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateDefenseEventHandlers();

        const defenseAbilities = shallow(<DefenseAbilities
            showSimpleView={true}
            inputs={input.defense}
            eventHandlers={events}
            ></DefenseAbilities>);

        const snapshot = shallowToJson(defenseAbilities);
        expect(snapshot).toMatchSnapshot();
    });
});
