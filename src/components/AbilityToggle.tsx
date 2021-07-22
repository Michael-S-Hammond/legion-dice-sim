import React from 'react';

type AbilityProps = {
    id: string,
    label: string,
    visible: boolean,
    active: boolean,
    onActiveChanged: (active: boolean) => void,
}

function AbilityToggle(props: AbilityProps) : JSX.Element {
    const handleActiveChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newActive = e.target.checked;
        props.onActiveChanged(newActive);
    }

    return (
        <div key={`${props.id}-abilitytoggle`} className={`${ props.visible ? 'd-flex collapse.show' : 'collapse'} justify-content-center my-3 custom-control custom-switch`}>
            <input key={`${props.id}-abilitytoggle-input`} type="checkbox" className="custom-control-input my-auto"
                id={props.id}
                checked={props.active}
                onChange={handleActiveChanged}></input>
            <label key={`${props.id}-abilitytoggle-label`} className="custom-control-label drop-down-label mx-2 my-auto" htmlFor={props.id}>{props.label}</label>
        </div>
    );
}

export default AbilityToggle;
