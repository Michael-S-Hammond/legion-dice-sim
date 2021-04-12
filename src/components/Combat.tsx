import React from 'react';

import * as T from '../code/Types';
import * as AS from './AppStateManager';

import AbilityToggle from './AbilityToggle';
import AbilityXToggle from './AbilityXToggle';

type CombatProps = {
    input: T.CombatInput,
    eventHandlers: AS.AppStateCombatEventHandlers,
};

class Combat extends React.Component<CombatProps> {
    constructor(props: CombatProps) {
        super(props);
    }

    render() : JSX.Element {
        return (
            <div>
                <h2 className="d-flex justify-content-center my-2">Combat</h2>
                <AbilityXToggle
                    id='guardianXToggle'
                    label='Guardian'
                    visible={true}
                    active={this.props.input.guardian.active}
                    onActiveChanged={this.props.eventHandlers.handleGuardianXChange}
                    value={this.props.input.guardian.value}
                    onValueChanged={this.props.eventHandlers.handleGuardianXValueChange}
                    maxValue={12}
                    ></AbilityXToggle>
                <AbilityToggle
                    id='meleeAttackToggle'
                    label='Melee Attack'
                    visible={true}
                    active={this.props.input.meleeAttack}
                    onActiveChanged={this.props.eventHandlers.handleMeleeAttackChange}
                    ></AbilityToggle>
            </div>
        )
    }
}

export default Combat;
