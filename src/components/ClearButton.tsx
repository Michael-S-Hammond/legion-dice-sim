import '../css/ClearButton.css';

import React from 'react';

type ClearButtonProps = {
    onClick: () => void,
    tooltip: string,
};

class ClearButton extends React.Component<ClearButtonProps> {
    constructor(props : ClearButtonProps) {
        super(props);
    }

    render() : JSX.Element {
        return (
            <button
                className="btn btn-secondary border rounded-lg clear-button mx-2 my-auto"
                onClick={() => this.props.onClick()}
                title={this.props.tooltip}>
            </button>
        );
    }
}

export default ClearButton;
