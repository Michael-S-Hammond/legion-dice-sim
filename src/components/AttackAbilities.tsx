import React from 'react';

import * as T from '../code/Types';
import * as SSM from './SimulatorStateManager';

import AbilityToggle from './AbilityToggle';
import AbilityXToggle from './AbilityXToggle'

type AttackAbilitiesProps = {
    showSimpleView: boolean,
    input: T.OffenseInput,
    eventHandlers: SSM.SimulatorStateAttackEventHandlers,
}

function AttackAbilities(props: AttackAbilitiesProps) : JSX.Element {
    return (
        <div>
            <AbilityToggle
                id='blastToggle'
                label='Blast'
                visible={!props.showSimpleView}
                active={props.input.blast}
                onActiveChanged={props.eventHandlers.handleBlastChange}
                ></AbilityToggle>
            <AbilityXToggle
                id='criticalXToggle'
                label='Critical'
                visible={true}
                active={props.input.criticalX.active}
                onActiveChanged={props.eventHandlers.handleCriticalXChange}
                value={props.input.criticalX.value}
                onValueChanged={props.eventHandlers.handleCriticalXValueChange}
                maxValue={4}
                ></AbilityXToggle>
            <AbilityToggle
                id='duelistAttackToggle'
                label='Duelist'
                visible={!props.showSimpleView}
                active={props.input.duelist}
                onActiveChanged={props.eventHandlers.handleDuelistChange}
                ></AbilityToggle>
            <AbilityToggle
                id='highVelocityToggle'
                label='High Velocity'
                visible={true}
                active={props.input.highVelocity}
                onActiveChanged={props.eventHandlers.handleHighVelocityChange}
                ></AbilityToggle>
            <AbilityXToggle
                id='impactXToggle'
                label='Impact'
                visible={true}
                active={props.input.impactX.active}
                onActiveChanged={props.eventHandlers.handleImpactXChange}
                value={props.input.impactX.value}
                onValueChanged={props.eventHandlers.handleImpactXValueChange}
                maxValue={9}
                ></AbilityXToggle>
            <AbilityXToggle
                id='ionXToggle'
                label='Ion'
                visible={!props.showSimpleView}
                active={props.input.ionX.active}
                onActiveChanged={props.eventHandlers.handleIonXChange}
                value={props.input.ionX.value}
                onValueChanged={props.eventHandlers.handleIonXValueChange}
                maxValue={2}
                ></AbilityXToggle>
            <AbilityToggle
                id='jediHunterToggle'
                label='Jedi Hunter'
                visible={!props.showSimpleView}
                active={props.input.jediHunter}
                onActiveChanged={props.eventHandlers.handleJediHunterChange}
                ></AbilityToggle>
            <AbilityXToggle
                id='lethalXToggle'
                label='Lethal'
                visible={!props.showSimpleView}
                active={props.input.lethalX.active}
                onActiveChanged={props.eventHandlers.handleLethalXChange}
                value={props.input.lethalX.value}
                onValueChanged={props.eventHandlers.handleLethalXValueChange}
                maxValue={2}
                ></AbilityXToggle>
            <AbilityToggle
                id='makashiMasteryToggle'
                label='Makashi Mastery'
                visible={!props.showSimpleView}
                active={props.input.makashiMastery}
                onActiveChanged={props.eventHandlers.handleMakashiMasteryChange}
                ></AbilityToggle>
            <AbilityToggle
                id='marksmanXToggle'
                label='Marksman'
                visible={!props.showSimpleView}
                alert='Marksman is not yet fully optimized for some edge cases, especially against Armor X.'
                active={props.input.marksman}
                onActiveChanged={props.eventHandlers.handleMarksmanChange}
                ></AbilityToggle>
            <AbilityXToggle
                id='pierceXToggle'
                label='Pierce'
                visible={true}
                active={props.input.pierceX.active}
                onActiveChanged={props.eventHandlers.handlePierceXChange}
                value={props.input.pierceX.value}
                onValueChanged={props.eventHandlers.handlePierceXValueChange}
                maxValue={3}
                ></AbilityXToggle>
            <AbilityXToggle
                id='preciseXToggle'
                label='Precise'
                visible={true}
                active={props.input.preciseX.active}
                onActiveChanged={props.eventHandlers.handlePreciseXChange}
                value={props.input.preciseX.value}
                onValueChanged={props.eventHandlers.handlePreciseXValueChange}
                maxValue={3}
                ></AbilityXToggle>
            <AbilityXToggle
                id='ramXToggle'
                label='Ram'
                visible={!props.showSimpleView}
                active={props.input.ramX.active}
                onActiveChanged={props.eventHandlers.handleRamXChange}
                value={props.input.ramX.value}
                onValueChanged={props.eventHandlers.handleRamXValueChange}
                maxValue={2}
                ></AbilityXToggle>
            <AbilityXToggle
                id='sharpshooterXToggle'
                label='Sharpshooter'
                visible={true}
                active={props.input.sharpshooterX.active}
                onActiveChanged={props.eventHandlers.handleSharpshooterXChange}
                value={props.input.sharpshooterX.value}
                onValueChanged={props.eventHandlers.handleSharpshooterXValueChange}
                maxValue={2}
                ></AbilityXToggle>
        </div>
    );
}

export default AttackAbilities;
