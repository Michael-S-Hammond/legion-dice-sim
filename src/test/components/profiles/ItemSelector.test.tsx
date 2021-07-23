import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as UP from '../../../code/profiles/UnitProfile';
import ItemSelector from '../../../components/profiles/ItemSelector';

describe('ItemSelector', () => {
    it('matches the snapshot', () => {
        const onWeaponChange = jest.fn();
        const unit = UP.getUnits().filter(u => u.name === 'Luke Skywalker' && u.rank === UP.Rank.commander)[0];
        const id = "ws-5";
        const index = 3;
        const selectedWeapon = unit.weapons[0];

        const selector = shallow(<ItemSelector<UP.Weapon>
                id={id}
                dataIndex={index}
                ariaLabel='testSelector'
                items={unit.weapons}
                includeBlankItem={true}
                selectedItem={selectedWeapon}
                onItemChange={onWeaponChange}
            />);
        const snapshot = shallowToJson(selector);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles value change', () => {
        const unit = UP.getUnits().filter(u => u.name === 'Luke Skywalker' && u.rank === UP.Rank.commander)[0];
        const id = "ws-5";
        const index = 3;
        const startingWeapon: UP.Weapon | null = null;
        let selectedWeapon: UP.Weapon | null = startingWeapon;
        let eventIndex = 0;

        function onWeaponChange(idx: any, newWeapon: UP.Weapon | null) {
            eventIndex = idx;
            selectedWeapon = newWeapon;
        }

        render(<ItemSelector<UP.Weapon>
                id={id}
                dataIndex={index}
                ariaLabel='testSelector'
                items={unit.weapons}
                includeBlankItem={true}
                selectedItem={startingWeapon}
                onItemChange={onWeaponChange}
            />);

        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'testSelector' }),
            [unit.weapons[1].name]);
        expect(eventIndex).toEqual(index);
        expect(selectedWeapon).toEqual(unit.weapons[1]);
    });

    it('handles clearing value', () => {
        const unit = UP.getUnits().filter(u => u.name === 'Luke Skywalker' && u.rank === UP.Rank.commander)[0];
        const id = "ws-5";
        const index = 3;
        const startingWeapon: UP.Weapon | null = unit.weapons[0];
        let selectedWeapon: UP.Weapon | null = startingWeapon;
        let eventIndex = 0;

        function onWeaponChange(idx: any, newWeapon: UP.Weapon | null) {
            eventIndex = idx;
            selectedWeapon = newWeapon;
        }

        render(<ItemSelector<UP.Weapon>
                id={id}
                dataIndex={index}
                ariaLabel='testSelector'
                items={unit.weapons}
                includeBlankItem={true}
                selectedItem={startingWeapon}
                onItemChange={onWeaponChange}
            />);

        userEvent.selectOptions(
            screen.getByRole('combobox', { name: 'testSelector' }),
            ['']);
        expect(eventIndex).toEqual(index);
        expect(selectedWeapon).toEqual(null);
    });
});
