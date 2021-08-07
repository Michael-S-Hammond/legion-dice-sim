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

function DefenseTokens(props: DefenseTokensProperties) : JSX.Element {
    return (
        <div>
            <div className="d-flex justify-content-center my-2">
                <Token visible={true} value={props.tokens.dodge} tokenCssClass='token-counter-dodge' onClick={props.eventHandlers.incrementDodgeTokenCount} tooltip='Dodge'></Token>
                <Token visible={true} value={props.tokens.surge} tokenCssClass='token-counter-surge' onClick={props.eventHandlers.incrementSurgeTokenCount} tooltip='Surge'></Token>
                <Token visible={!props.showSimplifiedView || props.tokens.shield != 0} value={props.tokens.shield} tokenCssClass='token-counter-shield' onClick={props.eventHandlers.incrementShieldTokenCount} tooltip='Shield'></Token>
                <Token visible={!props.showSimplifiedView || props.tokens.observation != 0} value={props.tokens.observation} tokenCssClass='token-counter-observation' onClick={props.eventHandlers.incrementObservationTokenCount} tooltip='Observation'></Token>
                <Token visible={true} value={props.tokens.suppression} tokenCssClass="token-counter-suppression" onClick={props.eventHandlers.incrementSuppressionTokenCount} tooltip='Suppression'></Token>
                <ClearButton onClick={props.eventHandlers.resetTokenCount} tooltip='Clear defense tokens'></ClearButton>
            </div>
        </div>
    );
}

export default DefenseTokens;
