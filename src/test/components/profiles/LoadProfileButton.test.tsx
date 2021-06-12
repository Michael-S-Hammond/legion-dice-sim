import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import LoadProfileButton from '../../../components/profiles/LoadProfileButton';

describe('FactionButtonGroup', () => {
    it('matches the snapshot', () => {
        const onFactionChange = jest.fn();
        const button = shallow(<LoadProfileButton
                dialogId='fakeDialog'
                tooltip='My tooltip'
            ></LoadProfileButton>);
        const snapshot = shallowToJson(button);
        expect(snapshot).toMatchSnapshot();
    });
});
