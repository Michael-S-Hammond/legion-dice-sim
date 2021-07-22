import '../css/DieCounter.css';

import React from 'react';

type DieCounterProps = {
    count: number,
    styleName: string,
    onClick: () => void,
};

function DieCounter(props: DieCounterProps) : JSX.Element {
    return (
        <button
            className={`btn border border-secondary rounded-lg die-counter mx-1 ${ props.styleName }`}
            onClick={() => props.onClick()}>
                { props.count }
        </button>
    );
}

export default DieCounter;
