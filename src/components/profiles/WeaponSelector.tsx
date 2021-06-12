import React from 'react';

import * as UP from '../../code/profiles/UnitProfile';

type WeaponSelectorProps = {
    id: string,
    dataWeaponIndex: number,
    weapons: Array<UP.Weapon>,
    selectedWeapon: UP.Weapon | null,
    onWeaponChange: (weapon: UP.Weapon | null) => void,
}

class WeaponSelector extends React.Component<WeaponSelectorProps> {
    private onWeaponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newWeaponName = e.target.value;
        let newWeapon: UP.Weapon | null = null;
        if(newWeaponName.length > 0) {
            const possibleWeapons = this.props.weapons.filter(w => w.name === newWeaponName);
            if(possibleWeapons.length > 0) {
                newWeapon = possibleWeapons[0];
            }
        }
        this.props.onWeaponChange(newWeapon);
    }

    render() : JSX.Element {
        return (
            <select
                id={this.props.id + "-weaponSelect"}
                value={this.props.selectedWeapon?.name}
                className="rounded-lg px-2"
                onChange={this.onWeaponChange}>
                <option key="" value=""></option>
                { this.props.weapons?.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
            </select>
        );
    }
}

export default WeaponSelector;
