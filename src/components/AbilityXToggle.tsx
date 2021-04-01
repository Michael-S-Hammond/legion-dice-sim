import React from 'react';

type AbilityXProps = {
    id: string,
    label: string,
    visible: boolean,
    active: boolean,
    onActiveChanged: Function,
    value: number,
    onValueChanged: Function,
    maxValue: number,
}

class AbilityXToggle extends React.Component<AbilityXProps> {
    constructor(props : AbilityXProps) {
        super(props);
    }
    
    handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = Number(e.target.value);
        this.props.onValueChanged(newValue);
    }

    handleActiveChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newActive = e.target.checked;
        this.props.onActiveChanged(newActive);
    }

    render() {
        const options = [];
        for(let i = 1; i <= this.props.maxValue; i++) {
            options.push(<option key={`${this.props.id}-abilityxtoggle-option-${i}`} value={i}>{i}</option>)
        }
        return (
            <div key={`${this.props.id}-abilityxtoggle`} className={`${ this.props.visible ? 'd-flex collapse.show' : 'collapse'} justify-content-center my-3 custom-control custom-switch`}>
                <input key={`${this.props.id}-abilityxtoggle-input`} type="checkbox" className="custom-control-input my-auto"
                    id={this.props.id}
                    checked={this.props.active}
                    onChange={this.handleActiveChanged}></input>
                <label key={`${this.props.id}-abilityxtoggle-label`} className="custom-control-label drop-down-label mx-2 my-auto" htmlFor={this.props.id}>{this.props.label}</label>
                <select key={`${this.props.id}-abilityxtoggle-select`} value={this.props.value} className="rounded-lg mr-4 px-2"
                    onChange={this.handleValueChange}>
                    {options}
                </select>
            </div>
        );
    }
}

export default AbilityXToggle;
