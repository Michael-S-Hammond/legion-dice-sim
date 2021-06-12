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

class Attack extends React.Component<AttackProps> {
    constructor(props : AttackProps) {
        super(props);
    }

    private handleAttackSurgeConversionChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const newConversion = Number(e.target.value);
        this.props.eventHandlers.handleSurgeConversionChange(newConversion);
    }

    render() : JSX.Element {
        return (
            <div>
                <h2 className="d-flex justify-content-center my-2">Attack
                    <LoadProfileButton
                        dialogId={this.props.profileDialogId}
                        tooltip='Load attack profile'></LoadProfileButton>
                </h2>

                <div className="d-flex justify-content-center my-2">
                    <DieCounter count={this.props.input.redDice} styleName="btn-danger" onClick={this.props.eventHandlers.incrementRedDice}></DieCounter>
                    <DieCounter count={this.props.input.blackDice} styleName="btn-dark" onClick={this.props.eventHandlers.incrementBlackDice}></DieCounter>
                    <DieCounter count={this.props.input.whiteDice} styleName="btn-light" onClick={this.props.eventHandlers.incrementWhiteDice}></DieCounter>
                    <ClearButton onClick={this.props.eventHandlers.resetDiceCount} tooltip='Clear attack dice'></ClearButton>
                </div>
                <AttackTokens
                    tokens={this.props.input.tokens}
                    eventHandlers={this.props.eventHandlers}
                    ></AttackTokens>
                <div className="d-flex justify-content-center my-2">
                    <span className="mx-2 my-auto drop-down-label">Surge:</span>
                    <select value={this.props.input.surge} className="rounded-lg mr-4 px-2"
                        onChange={this.handleAttackSurgeConversionChange}>
                        <option value="1">Blank</option>
                        <option value="2">Hit</option>
                        <option value="3">Critical</option>
                    </select>
                </div>
                <AttackAbilities
                    showSimpleView={this.props.showSimpleView}
                    input={this.props.input}
                    eventHandlers={this.props.eventHandlers}
                    ></AttackAbilities>
            </div>
        );
    }
}

export default Attack;
