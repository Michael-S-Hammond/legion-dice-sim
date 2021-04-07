import React from 'react';

import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';

import DieCounter from '../../components/DieCounter';

describe('DieCounter', () => {
    it('matches the snapshot', () => {
        const onClick = jest.fn();

        const counter = <DieCounter
                count={4}
                styleName='btn-dark'
                onClick={onClick}
            ></DieCounter>
        const snapshot = create(counter);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('handles being clicked', () => {
        const onButtonClickMock = jest.fn();

        const wrapper = shallow(<DieCounter
            count={4}
            styleName='btn-dark'
            onClick={onButtonClickMock}
        ></DieCounter>);
        wrapper.find('.btn').simulate('click');

        expect(onButtonClickMock).toHaveBeenCalledTimes(1);
    })
});
