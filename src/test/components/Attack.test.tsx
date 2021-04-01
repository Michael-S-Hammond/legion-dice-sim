import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as T from '../../code/Types';
import Attack from '../../components/Attack';

import * as EventMocks from '../mocks/EventHandlerMocks';

describe('Attack', () => {
    it('matches the snapshot', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateAttackEventHandlers();

        const attack = shallow(<Attack
            showSimpleView={false}
            input={input.offense}
            eventHandlers={events}
            ></Attack>);

        const snapshot = shallowToJson(attack);
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot for simplified view', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateAttackEventHandlers();

        const attack = shallow(<Attack
            showSimpleView={true}
            input={input.offense}
            eventHandlers={events}
            ></Attack>);

        const snapshot = shallowToJson(attack);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles surge conversion changing', () => {
        const input = T.createDefaultAttackInput();
        const events = EventMocks.createMockAppStateAttackEventHandlers();

        const wrapper = shallow(<Attack
            showSimpleView={true}
            input={input.offense}
            eventHandlers={events}
            ></Attack>);
        wrapper.find('select').simulate('change', { target: { value: 2 } });

        expect(events.handleSurgeConversionChange).toHaveBeenCalledTimes(1);
        expect(events.handleSurgeConversionChange).toHaveBeenCalledWith(2);
    })
});
