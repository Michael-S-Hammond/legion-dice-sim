import React from 'react';

type AbilityProps = {
    id: string,
    label: string,
    visible: boolean,
    active: boolean,
    onActiveChanged: (active: boolean) => void,
}

class AbilityToggle extends React.Component<AbilityProps> {
    constructor(props : AbilityProps) {
        super(props);
    }

    handleActiveChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newActive = e.target.checked;
        this.props.onActiveChanged(newActive);
    }

    render() {
        return (
            <div key={`${this.props.id}-abilitytoggle`} className={`${ this.props.visible ? 'd-flex collapse.show' : 'collapse'} justify-content-center my-3 custom-control custom-switch`}>
                <input key={`${this.props.id}-abilitytoggle-input`} type="checkbox" className="custom-control-input my-auto"
                    id={this.props.id}
                    checked={this.props.active}
                    onChange={this.handleActiveChanged}></input>
                <label key={`${this.props.id}-abilitytoggle-label`} className="custom-control-label drop-down-label mx-2 my-auto" htmlFor={this.props.id}>{this.props.label}</label>
            </div>
        );
    }
}

export default AbilityToggle;
