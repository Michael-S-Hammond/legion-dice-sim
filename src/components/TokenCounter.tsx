import '../css/TokenCounter.css';

import React from 'react';

type TokenProps = {
    visible: boolean,
    value: number,
    tokenCssClass: string,
    onClick: () => void,
    tooltip: string,
}

function Token(props: TokenProps) : JSX.Element {
    return (
        <div className={`${ props.visible ? 'collapse.show' : 'collapse'} token-parent`}>
            <button
                className={`btn border btn-light border-secondary rounded-lg mx-1 ${props.tokenCssClass}`}
                onClick={() => props.onClick()}
                title={props.tooltip}>
            </button>
            <span className="token-count">{props.value}</span>
        </div>
    );
}

export default Token;
