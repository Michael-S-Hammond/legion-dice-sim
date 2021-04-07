import '../css/SurgeDieSelector.css';

import React from 'react';

import * as T from '../code/Types'

type SurgeDieSelectorProps = {
    color: T.DieColor,
    surge: boolean,
    onClick: () => void,
}

class SurgeDieSelector extends React.Component<SurgeDieSelectorProps> {
    constructor(props : SurgeDieSelectorProps) {
        super(props);
    }

    private getSurgeStyle() : string {
        if(this.props.color == T.DieColor.White) {
            return 'surge-die-normal';
        }else{
            return 'surge-die-dark';
        }
    }

    render() {
        return (
            <button
                className={`btn border ${this.props.color == T.DieColor.Red ? 'btn-danger' : 'btn-light'} border-secondary rounded-lg selection-die mx-1 ${this.props.surge ? this.getSurgeStyle() : ''}`}
                onClick={() => this.props.onClick()}>
            </button>
        );
    }
}

export default SurgeDieSelector;
