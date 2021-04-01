import React from 'react';

import ClearButton from './ClearButton';
import Token from './TokenCounter';
import * as T from '../code/Types'
import * as AS from './AppStateManager';

type DefenseTokensProperties = {
    showSimplifiedView: boolean,
    tokens: T.DefenseTokens,
    eventHandlers: AS.AppStateDefenseEventHandlers,
}

class DefenseTokens extends React.Component<DefenseTokensProperties> {
    constructor(props : DefenseTokensProperties) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-center my-2">
                    <Token visible={true} value={this.props.tokens.dodge} tokenCssClass='token-counter-dodge' onClick={this.props.eventHandlers.incrementDodgeTokenCount} tooltip='Dodge'></Token>
                    <Token visible={true} value={this.props.tokens.surge} tokenCssClass='token-counter-surge' onClick={this.props.eventHandlers.incrementSurgeTokenCount} tooltip='Surge'></Token>
                    <Token visible={!this.props.showSimplifiedView || this.props.tokens.shield != 0} value={this.props.tokens.shield} tokenCssClass='token-counter-shield' onClick={this.props.eventHandlers.incrementShieldTokenCount} tooltip='Shield'></Token>
                    <Token visible={!this.props.showSimplifiedView || this.props.tokens.observation != 0} value={this.props.tokens.observation} tokenCssClass='token-counter-observation' onClick={this.props.eventHandlers.incrementObservationTokenCount} tooltip='Observation'></Token>
                    <Token visible={true} value={this.props.tokens.suppression} tokenCssClass="token-counter-suppression" onClick={this.props.eventHandlers.incrementSuppressionTokenCount} tooltip='Suppression'></Token>
                    <ClearButton onClick={this.props.eventHandlers.resetTokenCount} tooltip='Clear defense tokens'></ClearButton>
                </div>
            </div>
        );
    }
}

export default DefenseTokens;
