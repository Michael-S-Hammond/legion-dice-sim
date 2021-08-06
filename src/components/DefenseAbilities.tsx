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

function DefenseAbilities(props: DefenseAbilitiesProps) : JSX.Element {
    return (
        <div>
            <AbilityToggle
                id='armorToggle'
                label='Armor'
                visible={true}
                active={props.inputs.armor}
                onActiveChanged={props.eventHandlers.handleArmorChange}
                ></AbilityToggle>
            <AbilityXToggle
                id='armorXToggle'
                label='Armor'
                visible={!props.showSimpleView}
                active={props.inputs.armorX.active}
                onActiveChanged={props.eventHandlers.handleArmorXChange}
                value={props.inputs.armorX.value}
                onValueChanged={props.eventHandlers.handleArmorXValueChange}
                maxValue={2}
                ></AbilityXToggle>
            <AbilityToggle
                id='blockToggle'
                label='Block'
                visible={!props.showSimpleView}
                active={props.inputs.block}
                onActiveChanged={props.eventHandlers.handleBlockChange}
                ></AbilityToggle>
            <AbilityXToggle
                id='dangerSenseXToggle'
                label='Danger Sense'
                visible={!props.showSimpleView}
                active={props.inputs.dangerSenseX.active}
                onActiveChanged={props.eventHandlers.handleDangerSenseXChange}
                value={props.inputs.dangerSenseX.value}
                onValueChanged={props.eventHandlers.handleDangerSenseXValueChange}
                maxValue={4}
                ></AbilityXToggle>
            <AbilityToggle
                id='deflectToggle'
                label='Deflect'
                visible={true}
                active={props.inputs.deflect}
                onActiveChanged={props.eventHandlers.handleDeflectChange}
                ></AbilityToggle>
            <AbilityToggle
                id='djemSoMasteryToggle'
                label='Djem So Mastery'
                visible={!props.showSimpleView}
                active={props.inputs.djemSoMastery}
                onActiveChanged={props.eventHandlers.handleDjemSoMasteryChange}
                ></AbilityToggle>
            <AbilityToggle
                id='duelistDefenseToggle'
                label='Duelist'
                visible={!props.showSimpleView}
                active={props.inputs.duelist}
                onActiveChanged={props.eventHandlers.handleDuelistChange}
                ></AbilityToggle>
            <AbilityToggle
                id='hasForceUpgrades'
                label='Force Upgrade(s)'
                visible={!props.showSimpleView}
                active={props.inputs.hasForceUpgrades}
                onActiveChanged={props.eventHandlers.handleHasForceUpgradesChange}
                ></AbilityToggle>
            <AbilityToggle
                id='imperviousToggle'
                label='Impervious'
                visible={true}
                active={props.inputs.impervious}
                onActiveChanged={props.eventHandlers.handleImperviousChange}
                ></AbilityToggle>
            <AbilityToggle
                id='immuneBlastToggle'
                label='Immune: Blast'
                visible={!props.showSimpleView}
                active={props.inputs.immuneBlast}
                onActiveChanged={props.eventHandlers.handleImmuneBlastChange}
                ></AbilityToggle>
            <AbilityToggle
                id='immuneMeleePierceToggle'
                label='Immune: Melee Pierce'
                visible={!props.showSimpleView}
                active={props.inputs.immuneMeleePierce}
                onActiveChanged={props.eventHandlers.handleImmuneMeleePierceChange}
                ></AbilityToggle>
            <AbilityToggle
                id='immunePierceToggle'
                label='Immune: Pierce'
                visible={true}
                active={props.inputs.immunePierce}
                onActiveChanged={props.eventHandlers.handleImmunePierceChange}
                ></AbilityToggle>
            <AbilityToggle
                id='lowProfileToggle'
                label='Low Profile'
                visible={true}
                active={props.inputs.lowProfile}
                onActiveChanged={props.eventHandlers.handleLowProfileChange}
                ></AbilityToggle>
            <AbilityToggle
                id='outmaneuverToggle'
                label="Outmaneuver"
                visible={true}
                active={props.inputs.outmaneuver}
                onActiveChanged={props.eventHandlers.handleOutmaneuverChange}
                ></AbilityToggle>
            <AbilityToggle
                id='soresuMasteryToggle'
                label='Soresu Mastery'
                visible={!props.showSimpleView}
                active={props.inputs.soresuMastery}
                onActiveChanged={props.eventHandlers.handleSoresuMasteryChange}
                ></AbilityToggle>
            <AbilityXToggle
                id='uncannyLuckToggle'
                label='Uncanny Luck'
                visible={true}
                active={props.inputs.uncannyLuckX.active}
                onActiveChanged={props.eventHandlers.handleUncannyLuckXChange}
                value={props.inputs.uncannyLuckX.value}
                onValueChanged={props.eventHandlers.handleUncannyLuckXValueChange}
                maxValue={3}
                ></AbilityXToggle>
        </div>
    );
}

export default DefenseAbilities;
