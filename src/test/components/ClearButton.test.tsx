import React from 'react';

import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';

import ClearButton from '../../components/ClearButton';

describe('ClearButton', () => {
    it('matches the snapshot', () => {
        const onClick = jest.fn();

        const counter = <ClearButton
                onClick={onClick}
                tooltip='Clear...'
            ></ClearButton>
        const snapshot = create(counter);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('handles being clicked', () => {
        const onClick = jest.fn();

        const wrapper = shallow(<ClearButton
            onClick={onClick}
            tooltip='Clear...'
        ></ClearButton>);
        wrapper.find('.btn').simulate('click');

        expect(onClick).toHaveBeenCalledTimes(1);
    })
});
