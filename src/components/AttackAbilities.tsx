import React from 'react';

import * as T from '../code/Types';
import * as AS from './AppStateManager';
import AbilityToggle from './AbilityToggle';

import AbilityXToggle from './AbilityXToggle'

type AttackAbilitiesProps = {
    showSimpleView: boolean,
    input: T.OffenseInput,
    eventHandlers: AS.AppStateAttackEventHandlers,
}

class AttackAbilities extends React.Component<AttackAbilitiesProps> {
    constructor(props : AttackAbilitiesProps) {
        super(props);
    }

    render() : JSX.Element {
        return (
            <div>
                <AbilityToggle
                    id='blastToggle'
                    label='Blast'
                    visible={!this.props.showSimpleView}
                    active={this.props.input.blast}
                    onActiveChanged={this.props.eventHandlers.handleBlastChange}
                    ></AbilityToggle>
                <AbilityXToggle
                    id='criticalXToggle'
                    label='Critical'
                    visible={true}
                    active={this.props.input.criticalX.active}
                    onActiveChanged={this.props.eventHandlers.handleCriticalXChange}
                    value={this.props.input.criticalX.value}
                    onValueChanged={this.props.eventHandlers.handleCriticalXValueChange}
                    maxValue={3}
                    ></AbilityXToggle>
                <AbilityToggle
                    id='duelistAttackToggle'
                    label='Duelist'
                    visible={!this.props.showSimpleView}
                    active={this.props.input.duelist}
                    onActiveChanged={this.props.eventHandlers.handleDuelistChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='highVelocityToggle'
                    label='High Velocity'
                    visible={true}
                    active={this.props.input.highVelocity}
                    onActiveChanged={this.props.eventHandlers.handleHighVelocityChange}
                    ></AbilityToggle>
                <AbilityXToggle
                    id='impactXToggle'
                    label='Impact'
                    visible={true}
                    active={this.props.input.impactX.active}
                    onActiveChanged={this.props.eventHandlers.handleImpactXChange}
                    value={this.props.input.impactX.value}
                    onValueChanged={this.props.eventHandlers.handleImpactXValueChange}
                    maxValue={9}
                    ></AbilityXToggle>
                <AbilityXToggle
                    id='ionXToggle'
                    label='Ion'
                    visible={!this.props.showSimpleView}
                    active={this.props.input.ionX.active}
                    onActiveChanged={this.props.eventHandlers.handleIonXChange}
                    value={this.props.input.ionX.value}
                    onValueChanged={this.props.eventHandlers.handleIonXValueChange}
                    maxValue={2}
                    ></AbilityXToggle>
                <AbilityToggle
                    id='jediHunterToggle'
                    label='Jedi Hunter'
                    visible={!this.props.showSimpleView}
                    active={this.props.input.jediHunter}
                    onActiveChanged={this.props.eventHandlers.handleJediHunterChange}
                    ></AbilityToggle>
                <AbilityXToggle
                    id='lethalXToggle'
                    label='Lethal'
                    visible={true}
                    active={this.props.input.lethalX.active}
                    onActiveChanged={this.props.eventHandlers.handleLethalXChange}
                    value={this.props.input.lethalX.value}
                    onValueChanged={this.props.eventHandlers.handleLethalXValueChange}
                    maxValue={2}
                    ></AbilityXToggle>
                <AbilityToggle
                    id='makashiMasteryToggle'
                    label='Makashi Mastery'
                    visible={!this.props.showSimpleView}
                    active={this.props.input.makashiMastery}
                    onActiveChanged={this.props.eventHandlers.handleMakashiMasteryChange}
                    ></AbilityToggle>
                <AbilityXToggle
                    id='pierceXToggle'
                    label='Pierce'
                    visible={true}
                    active={this.props.input.pierceX.active}
                    onActiveChanged={this.props.eventHandlers.handlePierceXChange}
                    value={this.props.input.pierceX.value}
                    onValueChanged={this.props.eventHandlers.handlePierceXValueChange}
                    maxValue={3}
                    ></AbilityXToggle>
                <AbilityXToggle
                    id='preciseXToggle'
                    label='Precise'
                    visible={true}
                    active={this.props.input.preciseX.active}
                    onActiveChanged={this.props.eventHandlers.handlePreciseXChange}
                    value={this.props.input.preciseX.value}
                    onValueChanged={this.props.eventHandlers.handlePreciseXValueChange}
                    maxValue={3}
                    ></AbilityXToggle>
                <AbilityXToggle
                    id='ramXToggle'
                    label='Ram'
                    visible={!this.props.showSimpleView}
                    active={this.props.input.ramX.active}
                    onActiveChanged={this.props.eventHandlers.handleRamXChange}
                    value={this.props.input.ramX.value}
                    onValueChanged={this.props.eventHandlers.handleRamXValueChange}
                    maxValue={2}
                    ></AbilityXToggle>
                <AbilityXToggle
                    id='sharpshooterXToggle'
                    label='Sharpshooter'
                    visible={true}
                    active={this.props.input.sharpshooterX.active}
                    onActiveChanged={this.props.eventHandlers.handleSharpshooterXChange}
                    value={this.props.input.sharpshooterX.value}
                    onValueChanged={this.props.eventHandlers.handleSharpshooterXValueChange}
                    maxValue={2}
                    ></AbilityXToggle>
            </div>
        );
    }
}

export default AttackAbilities;
