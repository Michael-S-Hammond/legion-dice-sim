import '../css/DieCounter.css';

import React from 'react';

type DieCounterProps = {
    count: number,
    styleName: string,
    onClick: () => void,
};

class DieCounter extends React.Component<DieCounterProps> {
    constructor(props : DieCounterProps) {
        super(props);
    }

    render() {
        return (
            <button
                className={`btn border border-secondary rounded-lg die-counter mx-1 ${ this.props.styleName }`}
                onClick={() => this.props.onClick()}>
                    { this.props.count }
            </button>
        );
    }
}

export default DieCounter;
