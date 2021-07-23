import '../../css/ProfileDialog.css';

import React from 'react';

import $ from 'jquery';

import * as AL from '../../code/profiles/AllowList';
import * as UP from '../../code/profiles/UnitProfile';
import * as UC from '../../code/profiles/UpgradeCard';

import FactionButtonGroup from './FactionButtonGroup';
import ItemSelector from './ItemSelector';
import RankButtonGroup from './RankButtonGroup';
import UnitSelector from './UnitSelector';

import { Telemetry } from '../../tools/Telemetry';
import { useState } from 'react';

type ProfileSelectorDialogProps = {
    id: string,
    upgradeAllowListName: AL.AllowListName,
    applyProfile: (profile: UP.UnitProfile, weapon: Array<UP.Weapon>, upgrades: Array<UC.Upgrade>) => void
};

type ProfileSelectorDialogState = {
    units: Array<UP.UnitProfile>,
    faction: UP.Faction,
    rank: UP.Rank,
    unit: UP.UnitProfile,
    weapons: Array<UP.Weapon>,
    weaponSelectionCount: number,
    upgrades: Array<UC.Upgrade>
};

function ProfileSelectorDialog(props: ProfileSelectorDialogProps) : JSX.Element {
    const [state, setState] = useState(createDefaultState());

    function createDefaultState() : ProfileSelectorDialogState {
        const faction = UP.Faction.rebel;
        const rank = UP.Rank.commander;
        const units = getFilteredUnits(faction, rank);
        const unit = units[0];

        return {
            units: units,
            faction: faction,
            rank: rank,
            unit: unit,
            weapons: [],
            weaponSelectionCount: Math.min(getMaxCompatibleWeapons(unit), unit.keywords?.arsenal === undefined ? 1 : unit.keywords.arsenal),
            upgrades: []
        };
    }

    function getMaxCompatibleWeapons(unit: UP.UnitProfile) : number {
        let minRange = 0;
        let maxRange: number | undefined = undefined;
        let compatibleCount = 0;
        let maxCompatibleCount = 0;

        if(unit.weapons) {
            for(let i = 0; i < unit.weapons.length - maxCompatibleCount; i++) {
                minRange = 0;
                maxRange = undefined;
                compatibleCount = 0;

                for(let j = i; j < unit.weapons.length; j++) {
                    const weapon = unit.weapons[j];
                    if(UP.isRangeCompatible(weapon, minRange, maxRange)) {
                        compatibleCount++;
                        minRange = Math.max(minRange, weapon.minimumRange);
                        maxRange = maxRange === undefined ? weapon.maximumRange :
                            weapon.maximumRange === undefined ? maxRange :
                            Math.min(maxRange, weapon.maximumRange);
                    }
                    maxCompatibleCount = Math.max(compatibleCount, maxCompatibleCount);
                }
            }
        }

        return maxCompatibleCount;
    }

    function getNewStateObject(
        faction: UP.Faction | null = null,
        rank: UP.Rank | null = null,
        unit: UP.UnitProfile | null = null,
        weapons: Array<UP.Weapon> | null = null,
        upgrades: Array<UC.Upgrade> | null = null
            ) : ProfileSelectorDialogState {
        const newFaction = faction !== null ? faction : (state?.faction ? state.faction : UP.Faction.rebel);
        const newRank = rank !== null ? rank : (state?.rank ? state.rank : UP.Rank.commander);
        const newUnit = (unit !== null && unit.faction === newFaction && unit.rank === newRank) ? unit :
            (unit === null && newFaction == state?.faction && newRank == state?.rank && state?.unit ? state.unit : getFirstUnit(newFaction, newRank));
        const newWeapons = weapons !== null ? weapons : (newUnit === state?.unit ? state.weapons : []);
        const newUpgrades = upgrades !== null ? upgrades : (newUnit === state?.unit ? state.upgrades : []);

        return {
            units: getFilteredUnits(newFaction, newRank),
            faction: newFaction,
            rank: newRank,
            unit: newUnit,
            weapons: newWeapons,
            weaponSelectionCount: Math.min(getMaxCompatibleWeapons(newUnit), newUnit.keywords?.arsenal === undefined ? 1 : newUnit.keywords.arsenal),
            upgrades: newUpgrades
        };
    }

    function getFilteredUnits(faction: UP.Faction, rank: UP.Rank) : Array<UP.UnitProfile> {
        return UP.getUnits().filter(profile => profile.faction == faction && profile.rank == rank);
    }

    function getFilteredUpgradeTypes() : Array<UP.UnitUpgrade> {
        const filtered = state.unit.upgrades?.filter(u =>
            UC.getUpgrades().filter(ufilter => ufilter.type === u && isAvailable(ufilter)).length > 0
        );
        return filtered ? filtered : [];
    }

    const onFactionChange = (newFaction: UP.Faction) => {
        const newState = getNewStateObject(newFaction);
        setState(newState);
    }

    const onRankChange = (newRank: UP.Rank) => {
        const newState = getNewStateObject(undefined, newRank);
        setState(newState);
    }

    const onUnitChange = (unit: UP.UnitProfile | null) => {
        const newState = getNewStateObject(undefined, undefined, unit, undefined, undefined);
        setState(newState);
    }

    const onWeaponChange = (index: number, weapon: UP.Weapon | null) => {
        const newWeapons: Array<UP.Weapon> = [];
        state.weapons.forEach((w, i) => {
            // not copying the element at index so that it can be removed if desired
            if(i !== index) {
                newWeapons[i] = w;
            }
        });

        if(weapon && !newWeapons.includes(weapon)) {
            newWeapons[index] = weapon;
        }

        const newState = getNewStateObject(undefined, undefined, undefined, newWeapons, undefined);
        setState(newState);
    }

    const onUpgradeChange = (index: number, upgrade: UC.Upgrade | null) => {
        const newUpgrades: Array<UC.Upgrade> = [];
        state.upgrades.forEach((u, i) => {
            // not copying the element at index so that it can be removed if desired
            if(i !== index) {
                newUpgrades[i] = u;
            }
        });

        if(upgrade) {
            newUpgrades[index] = upgrade;
        }

        const newState = getNewStateObject(undefined, undefined, undefined, undefined, newUpgrades);
        setState(newState);
    }

    const onApplyChanges = () => {
        props.applyProfile(state.unit, state.weapons, state.upgrades);
        $('#' + props.id + '-closeButton').trigger('click');
    }

    function getFirstUnit(faction: UP.Faction, rank: UP.Rank) : UP.UnitProfile {
        const units = UP.getUnits().filter(profile =>
            profile.faction === faction &&
            profile.rank === rank);

        // if the result is undefined, we have a data problem
        if(units[0] === undefined) {
            Telemetry.logError("ProfileSelectorDialog.tsx", "getFirstUnit", "Unit not found");
        }
        return units[0];
    }

    function isAvailable(upgrade: UC.Upgrade, index?: number) : boolean {
        if(!AL.isUpgradeInAllowList(upgrade, props.upgradeAllowListName)) {
            return false;
        }

        if(index !== undefined) {
            let duplicate = false;
            state.upgrades.forEach((u, i) => {
                if(u.name === upgrade.name && u.type === upgrade.type && index !== i) {
                    duplicate = true;
                }
            });
            if(duplicate) {
                return false;
            }
        }

        if(!upgrade.restrictions || upgrade.restrictions.length === 0) {
            return true;
        }

        let foundMatch = false;
        upgrade.restrictions.forEach(r => {
            let match = true;

            if(r.faction && r.faction !== state.faction) {
                match = false;
            }

            if(r.unit && (r.unit !== state.unit.name) && ((r.unit + " *") !== state.unit.name)) {
                match = false;
            }

            if(r.type && r.type !== state.unit.unitType) {
                match = false;
            }

            if(r.rank && r.rank !== state.unit.rank) {
                match = false;
            }

            if(r.upgrade && !(state?.unit.upgrades && state.unit.upgrades.includes(r.upgrade))) {
                match = false;
            }

            if(r.not === true) {
                match = !match;
            }

            if(match) {
                foundMatch = true;
            }
        });
        return foundMatch;
    }

    function renderWeapons(count: number, condition: boolean) : JSX.Element | null {
        const children: Array<JSX.Element> = [];

        for(let i = 0; i < count && condition; i++) {
            children.push(
                <div key={props.id + "-weapon-" + i} className="row justify-content-center my-2">
                    <ItemSelector<UP.Weapon>
                        id={props.id + "-weapon-" + i}
                        dataIndex={i}
                        ariaLabel={'Weapon ' + i}
                        items={state.unit.weapons}
                        includeBlankItem={true}
                        selectedItem={state.weapons[i]}
                        onItemChange={onWeaponChange}
                    />
                </div>);
        }

        return children.length === 0 ? null :
            (<div>
                {children}
            </div>);
    }

    return (
        <div className="modal fade" id={props.id} tabIndex={-1} aria-labelledby={props.id + "ModalLabel"} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="{props.id + ModalLabel}">{props.upgradeAllowListName === AL.AllowListName.attack ? "Attack" : "Defense"} profile</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="container">
                            <div className="row justify-content-center my-2">
                                <FactionButtonGroup
                                    faction={state.faction}
                                    onFactionChange={onFactionChange}
                                ></FactionButtonGroup>
                            </div>
                            <div className="row justify-content-center my-2">
                                <RankButtonGroup
                                    rank={state.rank}
                                    onRankChange={onRankChange}
                                ></RankButtonGroup>
                            </div>
                            <div className="row justify-content-center my-2">
                                <UnitSelector
                                    id={props.id + "-unit"}
                                    units={state.units}
                                    selectedUnit={state.unit}
                                    onUnitChange={onUnitChange}
                                />
                            </div>{
                                renderWeapons(state.weaponSelectionCount, props.upgradeAllowListName === AL.AllowListName.attack)
                            }{
                                getFilteredUpgradeTypes().map((utype, i) =>
                                    <div key={i} className="row justify-content-center my-2">
                                        <img className={utype + "-upgrade-img"}></img>
                                        <ItemSelector<UC.Upgrade>
                                            id={props.id + "-" + i + "-upgrade"}
                                            dataIndex={i}
                                            ariaLabel={'Upgrade ' + i}
                                            includeBlankItem={true}
                                            items={UC.getUpgrades().filter((ufilter) => ufilter.type === utype && isAvailable(ufilter, i))}
                                            selectedItem={state.upgrades[i]}
                                            onItemChange={onUpgradeChange}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" id={props.id + "-closeButton"} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" id={props.id + "-applyButton"} className="btn btn-primary" onClick={onApplyChanges}>Apply</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileSelectorDialog;
