import '../css/ClearButton.css';

import React from 'react';

type ClearButtonProps = {
    onClick: () => void,
    tooltip: string,
};

function ClearButton(props: ClearButtonProps) : JSX.Element {
    return (
        <button
            className="btn btn-secondary border rounded-lg clear-button mx-2 my-auto"
            onClick={() => props.onClick()}
            title={props.tooltip}>
        </button>
    );
}

export default ClearButton;
