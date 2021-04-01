import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';

import * as T from '../../code/Types';
import SurgeDieSelector from '../../components/SurgeDieSelector';

describe('SurgeDieSelector', () => {
    it('matches the snapshot (white with surge)', () => {
        function onClick() {
        }

        const selector = <SurgeDieSelector
                color={T.DieColor.White}
                surge={true}
                onClick={onClick}
            ></SurgeDieSelector>;
        const snapshot = create(selector);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('matches the snapshot (red with surge)', () => {
        function onClick() {
        }

        const selector = <SurgeDieSelector
                color={T.DieColor.Red}
                surge={true}
                onClick={onClick}
            ></SurgeDieSelector>;
        const snapshot = create(selector);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('handles being clicked', () => {
        const onButtonClickMock = jest.fn();

        let wrapper = shallow(<SurgeDieSelector
                color={T.DieColor.Red}
                surge={false}
                onClick={onButtonClickMock}
            ></SurgeDieSelector>);
        wrapper.find('.btn').simulate('click');

        expect(onButtonClickMock).toHaveBeenCalledTimes(1);
    })
});
