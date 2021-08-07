import React from 'react';

import * as T from '../code/Types';
import * as AS from './AppStateManager';

import AttackAbilities from './AttackAbilities';
import AttackTokens from './AttackTokens';
import ClearButton from './ClearButton';
import DieCounter from './DieCounter';
import LoadProfileButton from './profiles/LoadProfileButton';

type AttackProps = {
    profileDialogId: string,
    showSimpleView: boolean,
    input: T.OffenseInput,
    eventHandlers: AS.AppStateAttackEventHandlers,
}

function Attack(props: AttackProps) : JSX.Element {
    const handleAttackSurgeConversionChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const newConversion = Number(e.target.value);
        props.eventHandlers.handleSurgeConversionChange(newConversion);
    }

    return (
        <div>
            <h2 className="d-flex justify-content-center my-2">Attack
                <LoadProfileButton
                    dialogId={props.profileDialogId}
                    tooltip='Load attack profile'/>
            </h2>

            <div className="d-flex justify-content-center my-2">
                <DieCounter count={props.input.redDice} styleName="btn-danger" onClick={props.eventHandlers.incrementRedDice}></DieCounter>
                <DieCounter count={props.input.blackDice} styleName="btn-dark" onClick={props.eventHandlers.incrementBlackDice}></DieCounter>
                <DieCounter count={props.input.whiteDice} styleName="btn-light" onClick={props.eventHandlers.incrementWhiteDice}></DieCounter>
                <ClearButton onClick={props.eventHandlers.resetDiceCount} tooltip='Clear attack dice'></ClearButton>
            </div>
            <AttackTokens
                tokens={props.input.tokens}
                eventHandlers={props.eventHandlers}
            ></AttackTokens>
            <div className="d-flex justify-content-center my-2">
                <span className="mx-2 my-auto drop-down-label">Surge:</span>
                <select value={props.input.surge} className="rounded-lg mr-4 px-2"
                    onChange={handleAttackSurgeConversionChange}>
                    <option value="1">Blank</option>
                    <option value="2">Hit</option>
                    <option value="3">Critical</option>
                </select>
            </div>
            <AttackAbilities
                showSimpleView={props.showSimpleView}
                input={props.input}
                eventHandlers={props.eventHandlers}
            ></AttackAbilities>
        </div>
    );
}

export default Attack;
