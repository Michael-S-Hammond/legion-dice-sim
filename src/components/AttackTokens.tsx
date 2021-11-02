import React from 'react';

import * as T from '../code/Types'
import * as SSM from './SimulatorStateManager';
import ClearButton from './ClearButton';
import Token from './TokenCounter';

type AttackTokensProperties = {
    tokens: T.OffenseTokens,
    eventHandlers: SSM.SimulatorStateAttackEventHandlers,
};

function AttackTokens(props: AttackTokensProperties) : JSX.Element {
    return (
        <div>
            <div className="single-result justify-content-center my-2">
                <Token visible={true} value={props.tokens.aim} tokenCssClass='token-counter-aim' onClick={props.eventHandlers.incrementAimTokenCount} tooltip='Aim'></Token>
                <Token visible={true} value={props.tokens.surge} tokenCssClass='token-counter-surge' onClick={props.eventHandlers.incrementSurgeTokenCount} tooltip='Surge'></Token>
                <ClearButton onClick={props.eventHandlers.resetTokenCounts} tooltip='Clear attack tokens'></ClearButton>
            </div>
        </div>
    );
}

export default AttackTokens;
