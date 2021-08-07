import React, { useEffect } from 'react';

type AbilityXProps = {
    id: string,
    label: string,
    visible: boolean,
    alert?: string,
    active: boolean,
    onActiveChanged: (active: boolean) => void,
    value: number,
    onValueChanged: (value: number) => void,
    maxValue: number,
}

function AbilityXToggle(props: AbilityXProps) : JSX.Element {
    const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = Number(e.target.value);
        props.onValueChanged(newValue);
    }

    const handleActiveChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newActive = e.target.checked;
        props.onActiveChanged(newActive);
    }

    function getOptions(count: number) : Array<JSX.Element> {
        const options: Array<JSX.Element> = [];
        for(let i = 1; i <= count; i++) {
            options.push(<option key={`${props.id}-abilityxtoggle-option-${i}`} value={i}>{i}</option>)
        }
        return options;
    }

    useEffect(() => {
        if(props.alert) {
            $('#' + props.id + '-abilitytoggle-popover').popover();
        }
    });

    return (
        <div key={`${props.id}-abilityxtoggle`} className={`${ props.visible ? 'd-flex collapse.show' : 'collapse'} justify-content-center my-3 custom-control custom-switch`}>
            <input key={`${props.id}-abilityxtoggle-input`} type="checkbox" className="custom-control-input my-auto"
                id={props.id}
                checked={props.active}
                onChange={handleActiveChanged}></input>
            <label key={`${props.id}-abilityxtoggle-label`} className="custom-control-label drop-down-label mx-2 my-auto" htmlFor={props.id}>{props.label}</label>
            <select key={`${props.id}-abilityxtoggle-select`} value={props.value} className="rounded-lg mr-4 px-2"
                onChange={handleValueChange}>
                {getOptions(props.maxValue)}
            </select>
            { props.alert &&
                <a id={`${props.id}-abilitytoggle-popover`} tabIndex={0} role="button" className="btn popover-button"
                    data-toggle="popover" data-trigger="focus" data-placement="top" title="Info"
                    data-content={props.alert}></a>
        }
        </div>
    );
}

export default AbilityXToggle;
