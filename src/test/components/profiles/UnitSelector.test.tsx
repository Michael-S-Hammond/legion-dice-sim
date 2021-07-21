import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as UP from '../../../code/profiles/UnitProfile';
import UnitSelector from 'components/profiles/UnitSelector';

describe('UnitSelector', () => {
    it('matches the snapshot', () => {
        const onUnitChange = jest.fn();
        const units = UP.getUnits().filter(u => u.faction === UP.Faction.empire && u.rank === UP.Rank.corps);
        const unit = units.filter(u => u.name === 'DF-90 Mortar Trooper')[0];

        const selector = shallow(<UnitSelector
                id='my-unit-selector'
                selectedUnit={unit}
                units={units}
                onUnitChange={onUnitChange}
            ></UnitSelector>);
        const snapshot = shallowToJson(selector);
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot with subtitle', () => {
        const onUnitChange = jest.fn();
        const units = UP.getUnits().filter(u => u.faction === UP.Faction.rebel && u.rank === UP.Rank.operative);
        const unit = units.filter(u => u.name === 'Luke Skywalker')[0];

        const selector = shallow(<UnitSelector
                id='my-unit-selector'
                selectedUnit={unit}
                units={units}
                onUnitChange={onUnitChange}
            ></UnitSelector>);
        const snapshot = shallowToJson(selector);
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot when multiple units have same name', () => {
        const onUnitChange = jest.fn();
        const units = UP.getUnits().filter(u => u.faction === UP.Faction.republic && u.rank === UP.Rank.specialForces);
        const unit = units.filter(u => u.name === 'ARC Troopers')[1];

        const selector = shallow(<UnitSelector
                id='my-unit-selector'
                selectedUnit={unit}
                units={units}
                onUnitChange={onUnitChange}
            ></UnitSelector>);
        const snapshot = shallowToJson(selector);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles unit change', () => {
        const units = UP.getUnits().filter(u => u.faction === UP.Faction.rebel && u.rank === UP.Rank.commander);
        let unit = units.filter(u => u.name === 'Luke Skywalker')[0];
        const targetUnit = units.filter(u => u.name === 'Han Solo')[0];

        const onUnitChange = jest.fn(newUnit => {
            unit = newUnit;
        });

        const wrapper = shallow(<UnitSelector
                id='my-unit-selector'
                selectedUnit={unit}
                units={units}
                onUnitChange={onUnitChange}
            ></UnitSelector>);
        wrapper.find('#my-unit-selector-nameSelect').simulate('change',
            { target: { value: 'Han Solo' } });

        expect(onUnitChange).toHaveBeenCalledTimes(1);
        expect(unit).toEqual(targetUnit);
    });

    it('handles unit change to one with multiple of the same name', () => {
        const units = UP.getUnits().filter(u => u.faction === UP.Faction.empire && u.rank === UP.Rank.specialForces);
        let unit = units.filter(u => u.name === 'Imperial Death Troopers')[0];
        const targetUnit = units.filter(u => u.name === 'Imperial Special Forces')[0];

        const onUnitChange = jest.fn(newUnit => {
            unit = newUnit;
        });

        const wrapper = shallow(<UnitSelector
                id='my-unit-selector'
                selectedUnit={unit}
                units={units}
                onUnitChange={onUnitChange}
            ></UnitSelector>);
        wrapper.find('#my-unit-selector-nameSelect').simulate('change',
            { target: { value: 'Imperial Special Forces' } });

        expect(onUnitChange).toHaveBeenCalledTimes(1);
        expect(unit).toEqual(targetUnit);
    });

    it('handles unit change to via subtitle', () => {
        const units = UP.getUnits().filter(u => u.faction === UP.Faction.republic && u.rank === UP.Rank.specialForces);
        let unit = units.filter(u => u.name === 'ARC Troopers')[0];
        const targetUnit = units.filter(u => u.name === 'ARC Troopers')[1];

        const onUnitChange = jest.fn(newUnit => {
            unit = newUnit;
        });

        const wrapper = shallow(<UnitSelector
                id='my-unit-selector'
                selectedUnit={unit}
                units={units}
                onUnitChange={onUnitChange}
            ></UnitSelector>);
        wrapper.find('#my-unit-selector-subtitleSelect').simulate('change',
            { target: { value: 'Strike Team' } });

        expect(onUnitChange).toHaveBeenCalledTimes(1);
        expect(unit).toEqual(targetUnit);
    });

    it('handles updating units', () => {
        const units = UP.getUnits().filter(u => u.faction === UP.Faction.separatist && u.rank === UP.Rank.specialForces);
        let unit = units[1];
        const newUnits = UP.getUnits().filter(u => u.faction === UP.Faction.separatist && u.rank === UP.Rank.operative);
        const targetUnit = newUnits[0];

        const onUnitChange = jest.fn(newUnit => {
            unit = newUnit;
        });

        const selector = shallow(<UnitSelector
                id='my-unit-selector'
                selectedUnit={unit}
                units={units}
                onUnitChange={onUnitChange}
            ></UnitSelector>);
        expect(selector.state('matchingNames')).toEqual(2);
        selector.setProps({
            units: newUnits,
            selectedUnit: targetUnit
        });
        expect(selector.state('matchingNames')).toEqual(1);
    });
});
