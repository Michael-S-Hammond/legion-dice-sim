import '../css/SurgeDieSelector.css';

import React from 'react';

import * as T from '../code/Types'

type SurgeDieSelectorProps = {
    color: T.DieColor,
    surge: boolean,
    onClick: () => void,
}

function SurgeDieSelector(props: SurgeDieSelectorProps) : JSX.Element {
    function getSurgeStyle() : string {
        if(props.color == T.DieColor.White) {
            return 'surge-die-normal';
        }else{
            return 'surge-die-dark';
        }
    }

    return (
        <button
            className={`btn border ${props.color == T.DieColor.Red ? 'btn-danger' : 'btn-light'} border-secondary rounded-lg selection-die mx-1 ${props.surge ? getSurgeStyle() : ''}`}
            onClick={() => props.onClick()}>
        </button>
    );
}

export default SurgeDieSelector;
