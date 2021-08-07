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
                <button id={`${props.id}-abilitytoggle-popover`} type="button" className="btn popover-button" data-container="body" data-toggle="popover" data-trigger="focus" data-placement="top" data-content={props.alert}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                    </svg>
                </button>
            }
        </div>
    );
}

export default AbilityXToggle;
