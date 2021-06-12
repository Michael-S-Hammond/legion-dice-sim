import '../../css/ProfileDialog.css';

import React from 'react';

import * as UP from '../../code/profiles/UnitProfile';
import * as UC from '../../code/profiles/UpgradeCard';

import FactionButtonGroup from './FactionButtonGroup';
import RankButtonGroup from './RankButtonGroup';
import WeaponSelector from './WeaponSelector';

import { Telemetry } from '../../tools/Telemetry';

type AttackProfileDialogProps = {
    id: string,
    applyAttackProfile: (profile: UP.UnitProfile, weapon: UP.Weapon | null, upgrades: Array<UC.Upgrade>) => void
};

type AttackProfileDialogState = {
    units: Array<UP.UnitProfile>,
    faction: UP.Faction,
    rank: UP.Rank,
    unit: UP.UnitProfile,
    weapon: UP.Weapon | null,
    upgrades: Array<UC.Upgrade>
};

class AttackProfileDialog extends React.Component<AttackProfileDialogProps, AttackProfileDialogState> {
    #units: Array<UP.UnitProfile>;

    constructor(props : AttackProfileDialogProps) {
        super(props);
        this.#units = UP.getUnits();
        this.state = this.getNewStateObject();
    }

    private getNewStateObject(
        faction: UP.Faction | null = null,
        rank: UP.Rank | null = null,
        unit: UP.UnitProfile | null = null,
        weapon: UP.Weapon | null = null,
        upgrades: Array<UC.Upgrade> = []
            ) : AttackProfileDialogState {
        const newFaction = faction === null ? (this.state ? this.state.faction : UP.Faction.rebel) : faction;
        const newRank = rank === null ? (this.state ? this.state.rank : UP.Rank.commander) : rank;
        const newUnit = (unit !== null && unit.faction === newFaction && unit.rank === newRank) ? unit :
            (unit === null && newFaction == this.state?.faction && newRank == this.state?.rank ? this.state?.unit : this.getFirstUnit(newFaction, newRank));
        const newWeapon = weapon !== null && newUnit.weapons.includes(weapon) ? weapon : null;
        const newUpgrades = newUnit !== unit ? [] : upgrades;

        return {
            units: this.getFilteredUnits(newFaction, newRank),
            faction: newFaction,
            rank: newRank,
            unit: newUnit,
            weapon: newWeapon,
            upgrades: newUpgrades
        };
    }

    private getFilteredUnits(faction: UP.Faction, rank: UP.Rank) : Array<UP.UnitProfile> {
        return this.#units.filter(profile => profile.faction == faction && profile.rank == rank);
    }

    private onFactionChange = (newFaction: UP.Faction) => {
        const newState = this.getNewStateObject(newFaction);
        this.setState(newState);
    }

    private onRankChange = (newRank: UP.Rank) => {
        const newState = this.getNewStateObject(undefined, newRank);
        this.setState(newState);
    }

    private onNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newName = e.target.value;
        const unit = this.getUnit(newName);
        const newState = this.getNewStateObject(this.state.faction, this.state.rank, unit);
        this.setState(newState);
    }

    private onWeaponChange = (weapon: UP.Weapon | null) => {
        const newState = this.getNewStateObject(undefined, undefined, undefined, weapon);
        this.setState(newState);
    }

    private onApplyChanges = () => {
        this.props.applyAttackProfile(this.state.unit, this.state.weapon, this.state.upgrades);
        $('#' + this.props.id + '-closeButton').trigger('click');
    }

    private getFirstUnit(faction: UP.Faction, rank: UP.Rank) : UP.UnitProfile {
        const units = this.#units.filter(profile =>
            profile.faction === faction &&
            profile.rank === rank);

        // if the result is undefined, we have a data problem
        if(units[0] === undefined) {
            Telemetry.logError("AttackProfileDialog.tsx", "getFirstUnit", "Unit not found");
        }
        return units[0];
    }

    private getUnit(name: string) : UP.UnitProfile {
        const units = this.#units.filter(profile =>
            profile.faction === this.state.faction &&
            profile.rank === this.state.rank &&
            profile.name === name);

        // callers are getting the name from the list of units, so it should always exist
        if(units[0] === undefined) {
            Telemetry.logError("AttackProfileDialog.tsx", "getUnit", "Unit not found");
        }
        return units[0];
    }

    private getUpgrade(type: UP.UnitUpgrade, name: string) : UC.Upgrade | null {
        const upgrades = UC.getUpgrades().filter(u =>
            u.type === type &&
            u.name === name);
        return upgrades.length === 1 ? upgrades[0] : null;
    }

    private isAvailable(upgrade: UC.Upgrade) : boolean {
        if(!upgrade.restrictions || upgrade.restrictions.length === 0) {
            return true;
        }

        let foundMatch = false;
        upgrade.restrictions.forEach(r => {
            let match = true;

            if(r.faction && r.faction !== this.state.faction) {
                match = false;
            }

            if(r.unit && (r.unit !== this.state.unit.name) && ((r.unit + " *") !== this.state.unit.name)) {
                match = false;
            }

            if(r.type && (!this.state.unit || r.type !== this.state.unit.unitType)) {
                match = false;
            }

            if(r.rank && (!this.state.unit || r.rank !== this.state.unit.rank)) {
                match = false;
            }

            if(match) {
                foundMatch = true;
            }
        });
        return foundMatch;
    }

    private onUpgradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const index = Number(e.target.dataset.upgradeIndex);
        const newUpgrades: Array<UC.Upgrade> = [];

        this.state.upgrades.forEach((u, i) => {
            // not copying the element at index so that it can be removed if desired
            if(i !== index) {
                newUpgrades[i] = u;
            }
        });
        const upgradeType = this.state.unit.upgrades ? this.state.unit.upgrades[index] : null;
        if(upgradeType) {
            const newUpgrade = this.getUpgrade(upgradeType, e.target.value);
            if(newUpgrade) {
                newUpgrades[index] = newUpgrade;
            }
        }

        const newState = this.getNewStateObject(undefined, undefined, undefined, undefined, newUpgrades);
        this.setState(newState);
    }

    private renderUpgradeSelect(upgrade: UP.UnitUpgrade, index: number) : JSX.Element {
        return (
            <select
                key={index + "-" + upgrade + "-upgrade-select"}
                data-upgrade-index={String(index)}
                value={this.state.upgrades[index]?.name}
                onChange={this.onUpgradeChange}
                className="rounded-lg px-2 ml-2">
            <option key="empty"></option>
            {
                UC.getUpgrades().filter(u => u.type === upgrade && this.isAvailable(u)).map((u, i) =>
                    <option
                        key={"option-" + index + "-" + i}
                        >{u.name}</option>
                )
            }
        </select>);
    }

    render() : JSX.Element {
        return (
            <div className="modal fade" id={this.props.id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attack profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row justify-content-center my-2">
                                    <FactionButtonGroup
                                        faction={this.state.faction}
                                        onFactionChange={this.onFactionChange}
                                    ></FactionButtonGroup>
                                </div>
                                <div className="row justify-content-center my-2">
                                    <RankButtonGroup
                                        rank={this.state.rank}
                                        onRankChange={this.onRankChange}
                                    ></RankButtonGroup>
                                </div>
                                <div className="row justify-content-center my-2">
                                    <select
                                        id={this.props.id + "-unitSelect"}
                                        value={this.state.unit.name}
                                        className="profile-select rounded-lg px-2"
                                        onChange={this.onNameChange}>
                                        { this.state.units.map(p => <option className="profile-option" key={p.name} value={p.name}>{p.name}</option>) }
                                    </select>
                                </div>
                                <div className="row justify-content-center my-2">
                                    <WeaponSelector
                                        id={this.props.id + "-" + 0 + "-weaponSelect"}
                                        dataWeaponIndex={0}
                                        weapons={this.state.unit.weapons}
                                        selectedWeapon={this.state.weapon}
                                        onWeaponChange={this.onWeaponChange}
                                    ></WeaponSelector>
                                </div>
                                {
                                    this.state.unit?.upgrades?.map((u, i) =>
                                        <div key={i} className="row justify-content-center my-2">
                                            <img className={u + "-upgrade-img"}></img>{ this.renderUpgradeSelect(u, i) }
                                        </div>)
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id={this.props.id + "-closeButton"} className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={this.onApplyChanges}>Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AttackProfileDialog;
