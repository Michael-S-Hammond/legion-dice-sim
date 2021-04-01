import React from 'react';

import * as T from '../code/Types';
import * as AS from './AppStateManager';

import AbilityToggle from './AbilityToggle';
import AbilityXToggle from './AbilityXToggle';

type DefenseAbilitiesProps = {
    showSimpleView: boolean,
    inputs: T.DefenseInput,
    eventHandlers: AS.AppStateDefenseEventHandlers,
}

class DefenseAbilities extends React.Component<DefenseAbilitiesProps> {
    constructor(props : DefenseAbilitiesProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <AbilityToggle
                    id='armorToggle'
                    label='Armor'
                    visible={true}
                    active={this.props.inputs.armor}
                    onActiveChanged={this.props.eventHandlers.handleArmorChange}
                    ></AbilityToggle>
                <AbilityXToggle
                    id='armorXToggle'
                    label='Armor'
                    visible={!this.props.showSimpleView}
                    active={this.props.inputs.armorX.active}
                    onActiveChanged={this.props.eventHandlers.handleArmorXChange}
                    value={this.props.inputs.armorX.value}
                    onValueChanged={this.props.eventHandlers.handleArmorXValueChange}
                    maxValue={2}
                    ></AbilityXToggle>
                <AbilityToggle
                    id='blockToggle'
                    label='Block'
                    visible={!this.props.showSimpleView}
                    active={this.props.inputs.block}
                    onActiveChanged={this.props.eventHandlers.handleBlockChange}
                    ></AbilityToggle>
                <AbilityXToggle
                    id='dangerSenseXToggle'
                    label='Danger Sense'
                    visible={!this.props.showSimpleView}
                    active={this.props.inputs.dangerSenseX.active}
                    onActiveChanged={this.props.eventHandlers.handleDangerSenseXChange}
                    value={this.props.inputs.dangerSenseX.value}
                    onValueChanged={this.props.eventHandlers.handleDangerSenseXValueChange}
                    maxValue={4}
                    ></AbilityXToggle>
                <AbilityToggle
                    id='deflectToggle'
                    label='Deflect'
                    visible={true}
                    active={this.props.inputs.deflect}
                    onActiveChanged={this.props.eventHandlers.handleDeflectChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='djemSoMasteryToggle'
                    label='Djem So Mastery'
                    visible={!this.props.showSimpleView}
                    active={this.props.inputs.djemSoMastery}
                    onActiveChanged={this.props.eventHandlers.handleDjemSoMasteryChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='duelistDefenseToggle'
                    label='Duelist'
                    visible={!this.props.showSimpleView}
                    active={this.props.inputs.duelist}
                    onActiveChanged={this.props.eventHandlers.handleDuelistChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='hasForceUpgrades'
                    label='Force Upgrade(s)'
                    visible={!this.props.showSimpleView}
                    active={this.props.inputs.hasForceUpgrades}
                    onActiveChanged={this.props.eventHandlers.handleHasForceUpgradesChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='imperviousToggle'
                    label='Impervious'
                    visible={true}
                    active={this.props.inputs.impervious}
                    onActiveChanged={this.props.eventHandlers.handleImperviousChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='immuneBlastToggle'
                    label='Immune: Blast'
                    visible={!this.props.showSimpleView}
                    active={this.props.inputs.immuneBlast}
                    onActiveChanged={this.props.eventHandlers.handleImmuneBlastChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='immunePierceToggle'
                    label='Immune: Pierce'
                    visible={true}
                    active={this.props.inputs.immunePierce}
                    onActiveChanged={this.props.eventHandlers.handleImmunePierceChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='lowProfileToggle'
                    label='Low Profile'
                    visible={true}
                    active={this.props.inputs.lowProfile}
                    onActiveChanged={this.props.eventHandlers.handleLowProfileChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='outmaneuverToggle'
                    label="Outmaneuver"
                    visible={true}
                    active={this.props.inputs.outmaneuver}
                    onActiveChanged={this.props.eventHandlers.handleOutmaneuverChange}
                    ></AbilityToggle>
                <AbilityToggle
                    id='soresuMasteryToggle'
                    label='Soresu Mastery'
                    visible={!this.props.showSimpleView}
                    active={this.props.inputs.soresuMastery}
                    onActiveChanged={this.props.eventHandlers.handleSoresuMasteryChange}
                    ></AbilityToggle>
                <AbilityXToggle
                    id='uncannyLuckToggle'
                    label='Uncanny Luck'
                    visible={true}
                    active={this.props.inputs.uncannyLuckX.active}
                    onActiveChanged={this.props.eventHandlers.handleUncannyLuckXChange}
                    value={this.props.inputs.uncannyLuckX.value}
                    onValueChanged={this.props.eventHandlers.handleUncannyLuckXValueChange}
                    maxValue={3}
                    ></AbilityXToggle>
            </div>
        );
    }
}

export default DefenseAbilities;
