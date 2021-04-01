import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';

import AbilityXToggle from '../../components/AbilityXToggle';

describe('AbilityXToggle', () => {
    it('matches the snapshot', () => {
        function onActiveChanged() {}
        function onValueChanged() {}

        const counter = <AbilityXToggle
                id='testAbility'
                label='Test'
                visible={true}
                active={true}
                onActiveChanged={onActiveChanged}
                value={1}
                onValueChanged={onValueChanged}
                maxValue={4}
            ></AbilityXToggle>;
        const snapshot = create(counter);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('matches the snapshot when hidden', () => {
        function onActiveChanged() {}
        function onValueChanged() {}

        const counter = <AbilityXToggle
                id='testAbility'
                label='Test'
                visible={false}
                active={true}
                onActiveChanged={onActiveChanged}
                value={1}
                onValueChanged={onValueChanged}
                maxValue={4}
            ></AbilityXToggle>;
        const snapshot = create(counter);
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    it('handles active changed', () => {
        let isActive = false;
        const onActiveChanged = jest.fn((newisActive) => {
            isActive = newisActive;
        });

        let value = 1;
        const onValueChanged = jest.fn((newValue) => {
            value = newValue;
        });

        const wrapper = shallow(<AbilityXToggle
                id='testAbility'
                label='Test'
                visible={true}
                active={false}
                onActiveChanged={onActiveChanged}
                value={3}
                onValueChanged={onValueChanged}
                maxValue={4}
            ></AbilityXToggle>);
        wrapper.find('.custom-control-input').simulate('change', { target: { checked: true }});

        expect(onActiveChanged).toHaveBeenCalledTimes(1);
        expect(isActive).toEqual(true);
        expect(onValueChanged).toHaveBeenCalledTimes(0);
    })

    it('handles value changed', () => {
        let isActive = false;
        const onActiveChanged = jest.fn((newisActive) => {
            isActive = newisActive;
        });

        let value = 1;
        const onValueChanged = jest.fn((newValue) => {
            value = newValue;
        });

        const wrapper = shallow(<AbilityXToggle
                id='testAbility'
                label='Test'
                visible={true}
                active={false}
                onActiveChanged={onActiveChanged}
                value={3}
                onValueChanged={onValueChanged}
                maxValue={5}
            ></AbilityXToggle>);
        wrapper.find('select').simulate('change', { target: { value: 2 }});

        expect(onActiveChanged).toHaveBeenCalledTimes(0);
        expect(onValueChanged).toHaveBeenCalledTimes(1);
        expect(value).toEqual(2);
    })
});
