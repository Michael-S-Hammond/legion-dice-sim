import React from 'react';

import * as T from '../code/Types'
import * as AS from './AppStateManager';
import ClearButton from './ClearButton';
import Token from './TokenCounter';

type AttackTokensProperties = {
    tokens: T.OffenseTokens,
    eventHandlers: AS.AppStateAttackEventHandlers,
};

class AttackTokens extends React.Component<AttackTokensProperties> {
    constructor(props : AttackTokensProperties) {
        super(props);
    }

    render() : JSX.Element {
        return (
            <div>
                <div className="single-result justify-content-center my-2">
                    <Token visible={true} value={this.props.tokens.aim} tokenCssClass='token-counter-aim' onClick={this.props.eventHandlers.incrementAimTokenCount} tooltip='Aim'></Token>
                    <Token visible={true} value={this.props.tokens.surge} tokenCssClass='token-counter-surge' onClick={this.props.eventHandlers.incrementSurgeTokenCount} tooltip='Surge'></Token>
                    <ClearButton onClick={this.props.eventHandlers.resetTokenCounts} tooltip='Clear attack tokens'></ClearButton>
                </div>
            </div>
        );
    }
}

export default AttackTokens;
