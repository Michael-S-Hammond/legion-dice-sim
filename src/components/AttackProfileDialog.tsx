import '../css/ProfileDialog.css';

import React from 'react';

import * as UP from 'code/profiles/UnitProfile';

type AttackProfileDialogProps = {
    id: string,
    applyAttackProfile: (profile: UP.UnitProfile, weapon: UP.Weapon) => void
};

type AttackProfileDialogState = {
    units: Array<UP.UnitProfile>,
    faction: UP.Faction,
    rank: UP.Rank,
    name: string,
    weapons: Array<UP.Weapon>,
    weapon: string
};

class AttackProfileDialog extends React.Component<AttackProfileDialogProps, AttackProfileDialogState> {
    #units: Array<UP.UnitProfile>;

    constructor(props : AttackProfileDialogProps) {
        super(props);
        this.#units = UP.getUnits();
        const unit = this.getFirstUnit(UP.Faction.rebel, UP.Rank.commander);
        this.state = {
            units: this.getFilteredUnits(UP.Faction.rebel, UP.Rank.commander),
            faction: UP.Faction.rebel,
            rank: UP.Rank.commander,
            name: unit ? unit.name : '',
            weapons: unit ? unit.weapons: [],
            weapon: unit && unit.weapons.length > 0 ? unit.weapons[0].name : ''
        }
    }

    private getFilteredUnits(faction: UP.Faction, rank: UP.Rank) : Array<UP.UnitProfile> {
        return this.#units.filter(profile => profile.faction == faction && profile.rank == rank);
    }

    private onFactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFaction = e.target.value as UP.Faction;
        const unit = this.getFirstUnit(newFaction, this.state.rank);
        this.setState({
            units: this.getFilteredUnits(newFaction, this.state.rank),
            faction: newFaction,
            rank: this.state.rank,
            name: unit ? unit.name : '',
            weapons: unit ? unit.weapons: [],
            weapon: unit && unit.weapons.length > 0 ? unit.weapons[0].name : ''
        });
    }

    private onRankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRank = e.target.value as UP.Rank;
        const unit = this.getFirstUnit(this.state.faction, newRank);
        this.setState({
            units: this.getFilteredUnits(this.state.faction, newRank),
            faction: this.state.faction,
            rank: newRank,
            name: unit ? unit.name : '',
            weapons: unit ? unit.weapons: [],
            weapon: unit && unit.weapons.length > 0 ? unit.weapons[0].name : ''
        });
    }

    private onNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newName = e.target.value;
        const unit = this.getUnit(this.state.faction, this.state.rank, newName);
        let weapons : Array<UP.Weapon> = [];
        if(unit !== null) {
            weapons = unit.weapons;
        }
        this.setState({
            units: this.state.units,
            faction: this.state.faction,
            rank: this.state.rank,
            name: newName,
            weapons: weapons,
            weapon: weapons.length > 0 ? weapons[0].name : ''
        });
    }

    private onWeaponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newWeapon = e.target.value;
        this.setState({
            units: this.state.units,
            faction: this.state.faction,
            rank: this.state.rank,
            name: this.state.name,
            weapons: this.state.weapons,
            weapon: newWeapon
        });
    }

    private onApplyChanges = () => {
        const unit = this.getUnit(this.state.faction, this.state.rank, this.state.name);
        if(unit !== null) {
            const weapon = unit.weapons.filter(w => w.name === this.state.weapon);
            if(weapon !== null && weapon.length === 1) {
                this.props.applyAttackProfile(unit, weapon[0]);
                $('#' + this.props.id + '-closeButton').trigger('click');
            }
        }
    }

    private getFirstUnit(faction: UP.Faction, rank: UP.Rank) : UP.UnitProfile | null {
        const units = this.#units.filter(profile =>
            profile.faction === faction &&
            profile.rank === rank);
        if(units.length > 0){
            return units[0];
        }
        return null;
    }

    private getUnit(faction: UP.Faction, rank: UP.Rank, name: string) : UP.UnitProfile | null {
        const units = this.#units.filter(profile =>
            profile.faction === faction &&
            profile.rank === rank &&
            profile.name === name);
        if(units.length === 1) {
            return units[0];
        }
        return null;
    }
    
    render() : JSX.Element {
        return (
            <div className="modal fade" id={this.props.id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered  modal-dialog-scrollable modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attack profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex justify-content-center my-2 btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-light faction-label active" title="Rebel">
                                    <input
                                        type="radio"
                                        name="faction"
                                        id={UP.Faction.rebel}
                                        value={UP.Faction.rebel}
                                        autoComplete="off"
                                        onChange={this.onFactionChange}
                                        checked={this.state.faction === UP.Faction.rebel}/>
                                    <img className='rebel-faction-img mx-1'></img>
                                </label>
                                <label className="btn btn-light faction-label" title="Empire">
                                    <input
                                        type="radio"
                                        name="faction"
                                        id={UP.Faction.empire}
                                        value={UP.Faction.empire}
                                        autoComplete="off"
                                        onChange={this.onFactionChange}
                                        checked={this.state.faction === UP.Faction.empire}/>
                                    <img className='empire-faction-img mx-1'></img>
                                </label>
                                <label className="btn btn-light faction-label" title="Republic">
                                    <input
                                        type="radio"
                                        name="faction"
                                        id={UP.Faction.republic}
                                        value={UP.Faction.republic}
                                        autoComplete="off"
                                        onChange={this.onFactionChange}
                                        checked={this.state.faction === UP.Faction.republic}/>
                                    <img className='republic-faction-img mx-1'></img>
                                </label>
                                <label className="btn btn-light faction-label" title="Separatist">
                                    <input
                                        type="radio"
                                        name="faction"
                                        id={UP.Faction.separatist}
                                        value={UP.Faction.separatist}
                                        autoComplete="off"
                                        onChange={this.onFactionChange}
                                        checked={this.state.faction === UP.Faction.separatist}/>
                                    <img className='separatist-faction-img mx-1'></img>
                                </label>
                            </div>
                            <div className="d-flex justify-content-center my-2 btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-light rank-label active" title="Commander">
                                    <input
                                        type="radio"
                                        name="rank"
                                        id={UP.Rank.commander}
                                        value={UP.Rank.commander}
                                        autoComplete="off"
                                        onChange={this.onRankChange}
                                        checked={this.state.rank === UP.Rank.commander}/>
                                    <img className='commander-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Operative">
                                    <input
                                        type="radio"
                                        name="rank"
                                        id={UP.Rank.operative}
                                        value={UP.Rank.operative}
                                        autoComplete="off"
                                        onChange={this.onRankChange}
                                        checked={this.state.rank === UP.Rank.operative}/>
                                    <img className='operative-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Corps">
                                    <input
                                        type="radio"
                                        name="rank"
                                        id={UP.Rank.corps}
                                        value={UP.Rank.corps}
                                        autoComplete="off"
                                        onChange={this.onRankChange}
                                        checked={this.state.rank === UP.Rank.corps}/>
                                    <img className='corps-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Special Forces">
                                    <input
                                        type="radio"
                                        name="rank"
                                        id={UP.Rank.specialForces}
                                        value={UP.Rank.specialForces}
                                        autoComplete="off"
                                        onChange={this.onRankChange}
                                        checked={this.state.rank === UP.Rank.specialForces}/>
                                    <img className='specialforces-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Support">
                                    <input
                                        type="radio"
                                        name="rank"
                                        id={UP.Rank.support}
                                        value={UP.Rank.support}
                                        autoComplete="off"
                                        onChange={this.onRankChange}
                                        checked={this.state.rank === UP.Rank.support}/>
                                    <img className='support-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Heavy">
                                    <input
                                        type="radio"
                                        name="rank"
                                        id={UP.Rank.heavy}
                                        value={UP.Rank.heavy}
                                        autoComplete="off"
                                        onChange={this.onRankChange}
                                        checked={this.state.rank === UP.Rank.heavy}/>
                                    <img className='heavy-rank-img mx-1'></img>
                                </label>
                            </div>
                            <div className="d-flex justify-content-center my-2">
                                <select
                                    id={this.props.id + "-unitSelect"}
                                    value={this.state.name}
                                    className="rounded-lg px-2"
                                    onChange={this.onNameChange}>
                                    { this.state.units.map(p => <option key={p.name} value={p.name}>{p.name}</option>) }
                                </select>
                            </div>
                            <div className="d-flex justify-content-center my-2">
                                <select
                                    id={this.props.id + "-weaponSelect"}
                                    value={this.state.weapon}
                                    className="rounded-lg px-2"
                                    onChange={this.onWeaponChange}>
                                    { this.state.weapons.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
                                </select>
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
