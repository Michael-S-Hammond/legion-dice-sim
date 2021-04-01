import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';

import ClearButton from '../../components/ClearButton';

describe('ClearButton', () => {
    it('matches the snapshot', () => {
        function onClick() {
        }

        const counter = <ClearButton
                onClick={onClick}
                tooltip='Clear...'
            ></ClearButton>
        const snapshot = create(counter);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('handles being clicked', () => {
        const onButtonClickMock = jest.fn();

        let wrapper = shallow(<ClearButton
            onClick={onButtonClickMock}
            tooltip='Clear...'
        ></ClearButton>);
        wrapper.find('.btn').simulate('click');

        expect(onButtonClickMock).toHaveBeenCalledTimes(1);
    })
});
