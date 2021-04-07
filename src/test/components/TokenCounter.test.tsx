import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import TokenCounter from '../../components/TokenCounter';

describe('TokenCounter', () => {
    it('matches the snapshot', () => {
        const onClick = jest.fn();

        const counter = shallow(<TokenCounter
            visible={true}
            value={3}
            onClick={onClick}
            tokenCssClass='token-counter-aim'
            tooltip='Helpful text'
            ></TokenCounter>);
        const snapshot = shallowToJson(counter);
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot when not visible', () => {
        const onClick = jest.fn();

        const counter = shallow(<TokenCounter
            visible={false}
            value={1}
            onClick={onClick}
            tokenCssClass='token-counter-observe'
            tooltip='Watching!'
            ></TokenCounter>);
        const snapshot = shallowToJson(counter);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles being clicked', () => {
        const onClick = jest.fn();

        const wrapper = shallow(<TokenCounter
            visible={true}
            value={2}
            onClick={onClick}
            tokenCssClass='token-counter-dodge'
            tooltip='Dodging...'
            ></TokenCounter>);
        wrapper.find('.btn').simulate('click');

        expect(onClick).toHaveBeenCalledTimes(1);
    })
});
