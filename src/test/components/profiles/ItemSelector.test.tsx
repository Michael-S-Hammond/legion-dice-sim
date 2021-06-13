import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as UP from '../../../code/profiles/UnitProfile';
import ItemSelector from '../../../components/profiles/ItemSelector';

describe('ItemSelector', () => {
    it('matches the snapshot', () => {
        const onWeaponChange = jest.fn();
        const id = "ws-5";
        const index = 3;
        const selectedWeapon: UP.Weapon = {
            name: "Lightsaber",
            minimumRange: 0,
            maximumRange: 0,
            dice: {
                red: 3,
                black: 2,
                white: 1
            },
            keywords: {
                impact: 2,
                pierce: 2
            }
        };
        const weapons = [
            selectedWeapon, {
                name: "Blaster",
                minimumRange: 1,
                maximumRange: 2,
                dice: {
                    red: 0,
                    black: 1,
                    white: 4
                },
                keywords: {
                    pierce: 1
                }
            }
        ];

        const selector = shallow(<ItemSelector<UP.Weapon>
                id={id}
                dataIndex={index}
                items={weapons}
                selectedItem={selectedWeapon}
                onItemChange={onWeaponChange}
            />);
        const snapshot = shallowToJson(selector);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles value change', () => {
        let weapon: UP.Weapon | null = null;
        const onWeaponChange = jest.fn((_, newWeapon) => {
            weapon = newWeapon;
        });
        const id = "ws-5";
        const index = 3;
        const selectedWeapon: UP.Weapon = {
            name: "Lightsaber",
            minimumRange: 0,
            maximumRange: 0,
            dice: {
                red: 3,
                black: 2,
                white: 1
            },
            keywords: {
                impact: 2,
                pierce: 2
            }
        };
        const weapons = [
            selectedWeapon, {
                name: "Blaster",
                minimumRange: 1,
                maximumRange: 2,
                dice: {
                    red: 0,
                    black: 1,
                    white: 4
                },
                keywords: {
                    pierce: 1
                }
            }
        ];

        const wrapper = shallow(<ItemSelector<UP.Weapon>
            id={id}
            dataIndex={index}
            items={weapons}
            selectedItem={selectedWeapon}
            onItemChange={onWeaponChange}
        />);
        wrapper.find("#" + id + "-itemSelect").simulate('change', { target: { value: weapons[1].name }});

        expect(onWeaponChange).toHaveBeenCalledTimes(1);
        expect(weapon).toEqual(weapons[1]);
    })

    it('handles clearing value', () => {
        let weapon: UP.Weapon | null = null;
        const onWeaponChange = jest.fn((_, newWeapon) => {
            weapon = newWeapon;
        });
        const id = "ws-5";
        const index = 3;
        const selectedWeapon: UP.Weapon = {
            name: "Lightsaber",
            minimumRange: 0,
            maximumRange: 0,
            dice: {
                red: 3,
                black: 2,
                white: 1
            },
            keywords: {
                impact: 2,
                pierce: 2
            }
        };
        const weapons = [
            selectedWeapon, {
                name: "Blaster",
                minimumRange: 1,
                maximumRange: 2,
                dice: {
                    red: 0,
                    black: 1,
                    white: 4
                },
                keywords: {
                    pierce: 1
                }
            }
        ];

        const wrapper = shallow(<ItemSelector<UP.Weapon>
            id={id}
            dataIndex={index}
            items={weapons}
            selectedItem={selectedWeapon}
            onItemChange={onWeaponChange}
        />);
        wrapper.find("#" + id + "-itemSelect").simulate('change', { target: { value: "" }});

        expect(onWeaponChange).toHaveBeenCalledTimes(1);
        expect(weapon).toBeNull();
    })
});
