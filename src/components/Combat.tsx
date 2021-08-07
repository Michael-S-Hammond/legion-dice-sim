import React from 'react';

import * as T from '../code/Types';
import * as AS from './AppStateManager';

import AbilityToggle from './AbilityToggle';
import AbilityXToggle from './AbilityXToggle';

type CombatProps = {
    input: T.CombatInput,
    eventHandlers: AS.AppStateCombatEventHandlers,
};

function Combat(props: CombatProps) : JSX.Element {
    return (
        <div>
            <h2 className="d-flex justify-content-center my-2">Combat</h2>
            <AbilityXToggle
                id='guardianXToggle'
                label='Guardian'
                visible={true}
                active={props.input.guardian.active}
                onActiveChanged={props.eventHandlers.handleGuardianXChange}
                value={props.input.guardian.value}
                onValueChanged={props.eventHandlers.handleGuardianXValueChange}
                maxValue={12}
                ></AbilityXToggle>
            <AbilityToggle
                id='meleeAttackToggle'
                label='Melee Attack'
                visible={true}
                active={props.input.meleeAttack}
                onActiveChanged={props.eventHandlers.handleMeleeAttackChange}
                ></AbilityToggle>
        </div>
    );
}

export default Combat;
