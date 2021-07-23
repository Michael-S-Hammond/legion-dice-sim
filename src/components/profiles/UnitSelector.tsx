import React, { useEffect, useState } from 'react';

import * as UP from '../../code/profiles/UnitProfile';

type UnitSelectorProps = {
    id: string,
    units: Array<UP.UnitProfile>,
    selectedUnit: UP.UnitProfile,
    onUnitChange: (unit: UP.UnitProfile) => void,
}

function UnitSelector(props: UnitSelectorProps) : JSX.Element {
    const [matchingNames, setMatchingNames] = useState(getMatchingNameCount(props.selectedUnit.name));

    function getMatchingNameCount(name: string): number {
        const count = props.units.filter(u => u.name === name).length;
        return count;
    }

    function doesSubtitleMatch(first: string | undefined, second: string): boolean {
        return (first === undefined && second.length === 0) || first === second;
    }

    const onNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newName = e.target.value;
        let newUnit = props.selectedUnit;

        const possibleUnits = props.units.filter(u => u.name === newName);
        if(possibleUnits.length > 0) {
            newUnit = possibleUnits[0];
        }

        if(newUnit !== props.selectedUnit) {
            props.onUnitChange(newUnit);
        }
    }

    const onSubtitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSubtitle = e.target.value;
        let newUnit = props.selectedUnit;

        const possibleUnits = props.units.filter(u => u.name === props.selectedUnit.name && doesSubtitleMatch(u.subtitle, newSubtitle));
        if(possibleUnits.length > 0) {
            newUnit = possibleUnits[0];
        }

        if(newUnit !== props.selectedUnit) {
            props.onUnitChange(newUnit);
        }
    }

    useEffect(() => {
        setMatchingNames(getMatchingNameCount(props.selectedUnit.name));
    }, [props.selectedUnit]);

    return (
        <div>
            <div className="d-flex mx-auto">
                <select
                    id={props.id + "-nameSelect"}
                    value={props.selectedUnit.name}
                    className="rounded px-2 mx-auto"
                    aria-label="Unit name"
                    onChange={onNameChange}>
                    { [...new Set(props.units.map(u => u.name))].
                        map(name => <option key={name} value={name}>{name}</option>)}
                </select>
            </div>
            { matchingNames === 1 && props.selectedUnit.subtitle && props.selectedUnit.subtitle.length > 0 &&
                <div key={props.id + "-subtitle-one"} className="text-center mt-2 mx-auto">{ props.selectedUnit.subtitle }</div>
            }
            { matchingNames > 1 &&
                <div className="d-flex mx-auto mt-2">
                    <select
                        id={props.id + "-subtitleSelect"}
                        value={props.selectedUnit.subtitle}
                        className="rounded px-2 mx-auto"
                        aria-label="Unit subtitle"
                        onChange={onSubtitleChange}>
                        { props.units.filter(u => u.name === props.selectedUnit.name).map(u =>
                            <option key={u.name + "-" + u.subtitle} value={u.subtitle}>{u.subtitle}</option>) }
                    </select>
                </div>
            }
        </div>
    );
}

export default UnitSelector;
