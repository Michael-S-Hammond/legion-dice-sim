import React from 'react';

import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';

import * as T from '../../code/Types';
import SurgeDieSelector from '../../components/SurgeDieSelector';

describe('SurgeDieSelector', () => {
    it('matches the snapshot (white with surge)', () => {
        const onClick = jest.fn();

        const selector = <SurgeDieSelector
                color={T.DieColor.White}
                surge={true}
                onClick={onClick}
            ></SurgeDieSelector>;
        const snapshot = create(selector);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('matches the snapshot (red with surge)', () => {
        const onClick = jest.fn();

        const selector = <SurgeDieSelector
                color={T.DieColor.Red}
                surge={true}
                onClick={onClick}
            ></SurgeDieSelector>;
        const snapshot = create(selector);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('handles being clicked', () => {
        const onClick = jest.fn();

        const wrapper = shallow(<SurgeDieSelector
                color={T.DieColor.Red}
                surge={false}
                onClick={onClick}
            ></SurgeDieSelector>);
        wrapper.find('.btn').simulate('click');

        expect(onClick).toHaveBeenCalledTimes(1);
    })
});
