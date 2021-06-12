import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as UP from '../../../code/profiles/UnitProfile';
import WeaponSelector from '../../../components/profiles/WeaponSelector';

describe('WeaponSelector', () => {
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

        const selector = shallow(<WeaponSelector
                id={id}
                dataWeaponIndex={index}
                weapons={weapons}
                selectedWeapon={selectedWeapon}
                onWeaponChange={onWeaponChange}
            ></WeaponSelector>);
        const snapshot = shallowToJson(selector);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles value change', () => {
        let weapon: UP.Weapon | null = null;
        const onWeaponChange = jest.fn((newWeapon) => {
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

        const wrapper = shallow(<WeaponSelector
            id={id}
            dataWeaponIndex={index}
            weapons={weapons}
            selectedWeapon={selectedWeapon}
            onWeaponChange={onWeaponChange}
        ></WeaponSelector>);
        wrapper.find("#" + id + "-weaponSelect").simulate('change', { target: { value: weapons[1].name }});

        expect(onWeaponChange).toHaveBeenCalledTimes(1);
        expect(weapon).toEqual(weapons[1]);
    })

    it('handles clearing value', () => {
        let weapon: UP.Weapon | null = null;
        const onWeaponChange = jest.fn((newWeapon) => {
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

        const wrapper = shallow(<WeaponSelector
            id={id}
            dataWeaponIndex={index}
            weapons={weapons}
            selectedWeapon={selectedWeapon}
            onWeaponChange={onWeaponChange}
        ></WeaponSelector>);
        wrapper.find("#" + id + "-weaponSelect").simulate('change', { target: { value: "" }});

        expect(onWeaponChange).toHaveBeenCalledTimes(1);
        expect(weapon).toBeNull();
    })
});
