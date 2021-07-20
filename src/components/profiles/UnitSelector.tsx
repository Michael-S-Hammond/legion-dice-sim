import React from 'react';

import * as UP from '../../code/profiles/UnitProfile';

type UnitSelectorProps = {
    id: string,
    units: Array<UP.UnitProfile>,
    selectedUnit: UP.UnitProfile,
    onUnitChange: (unit: UP.UnitProfile) => void,
}

type UnitSelectorState = {
    matchingNames: number
}

class UnitSelector extends React.Component<UnitSelectorProps, UnitSelectorState> {
    constructor(props : UnitSelectorProps) {
        super(props);

        this.state = {
            matchingNames: this.getMatchingNameCount(props.selectedUnit.name)
        };
    }

    private getMatchingNameCount(name: string): number {
        const count = this.props.units.filter(u => u.name === name).length;
        return count;
    }

    private doesSubtitleMatch(first: string | undefined, second: string): boolean {
        return (first === undefined && second.length === 0) || first === second;
    }

    private onNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newName = e.target.value;
        let newUnit = this.props.selectedUnit;

        const possibleUnits = this.props.units.filter(u => u.name === newName);
        if(possibleUnits.length > 0) {
            newUnit = possibleUnits[0];
        }

        if(newUnit !== this.props.selectedUnit) {
            this.props.onUnitChange(newUnit);
        }
    }

    private onSubtitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSubtitle = e.target.value;
        let newUnit = this.props.selectedUnit;

        const possibleUnits = this.props.units.filter(u => u.name === this.props.selectedUnit.name && this.doesSubtitleMatch(u.subtitle, newSubtitle));
        if(possibleUnits.length > 0) {
            newUnit = possibleUnits[0];
        }

        if(newUnit !== this.props.selectedUnit) {
            this.props.onUnitChange(newUnit);
        }
    }

    componentDidUpdate(prevProps: UnitSelectorProps) : void {
        if(prevProps.selectedUnit !== this.props.selectedUnit) {
            this.setState({
                matchingNames: this.getMatchingNameCount(this.props.selectedUnit.name)
            });
        }
    }

    render() : JSX.Element {
        return (
            <div>
                <div className="d-flex mx-auto">
                    <select
                        id={this.props.id + "-nameSelect"}
                        value={this.props.selectedUnit.name}
                        className="rounded px-2 mx-auto"
                        onChange={this.onNameChange}>
                        { [...new Set(this.props.units.map(u => u.name))].
                            map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                { this.state.matchingNames === 1 && this.props.selectedUnit.subtitle && this.props.selectedUnit.subtitle.length > 0 &&
                    <div key={this.props.id + "-subtitle-one"} className="text-center mt-2 mx-auto">{ this.props.selectedUnit.subtitle }</div>
                }
                { this.state.matchingNames > 1 &&
                    <div className="d-flex mx-auto mt-2">
                        <select
                            id={this.props.id + "-subtitleSelect"}
                            value={this.props.selectedUnit.subtitle}
                            className="rounded px-2 mx-auto"
                            onChange={this.onSubtitleChange}>
                            { this.props.units.filter(u => u.name === this.props.selectedUnit.name).map(u =>
                                <option key={u.name + "-" + u.subtitle} value={u.subtitle}>{u.subtitle}</option>) }
                        </select>
                    </div>
                }
            </div>
        );
    }
}

export default UnitSelector;
