import '../css/TokenCounter.css';

import React from 'react';

type TokenProps = {
    visible: boolean,
    value: number,
    tokenCssClass: string,
    onClick: () => void,
    tooltip: string,
}

class Token extends React.Component<TokenProps> {
    constructor(props : TokenProps) {
        super(props);
    }

    render() : JSX.Element {
        return (
            <div className={`${ this.props.visible ? 'collapse.show' : 'collapse'} token-parent`}>
                <button
                    className={`btn border btn-light border-secondary rounded-lg mx-1 ${this.props.tokenCssClass}`}
                    onClick={() => this.props.onClick()}
                    title={this.props.tooltip}>
                </button>
                <span className="token-count">{this.props.value}</span>
            </div>
        );
    }
}

export default Token;
