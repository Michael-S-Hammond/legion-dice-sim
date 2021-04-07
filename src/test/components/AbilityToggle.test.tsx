import React from 'react';

import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';

import AbilityToggle from '../../components/AbilityToggle';

describe('AbilityToggle', () => {
    it('matches the snapshot', () => {
        const onActiveChanged = jest.fn();

        const counter = <AbilityToggle
                id='testAbility'
                label='Test'
                visible={true}
                active={true}
                onActiveChanged={onActiveChanged}
            ></AbilityToggle>;
        const snapshot = create(counter);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('matches the snapshot when not visible', () => {
        const onActiveChanged = jest.fn();

        const counter = <AbilityToggle
                id='testAbility'
                label='Test'
                visible={false}
                active={true}
                onActiveChanged={onActiveChanged}
            ></AbilityToggle>;
        const snapshot = create(counter);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('handles active changed', () => {
        let isActive = false;
        const onActiveChanged = jest.fn((newisActive) => {
            isActive = newisActive;
        });

        const wrapper = shallow(<AbilityToggle
                id='testAbility'
                label='Test'
                visible={true}
                active={false}
                onActiveChanged={onActiveChanged}
            ></AbilityToggle>);

        wrapper.find('.custom-control-input').simulate('change', { target: { checked: true }});
        expect(onActiveChanged).toHaveBeenCalledTimes(1);
        expect(isActive).toEqual(true);
    })
});
