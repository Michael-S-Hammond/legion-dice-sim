import '../../css/ProfileDialog.css';

import React from 'react';

import * as AL from '../../code/profiles/AllowList';
import * as UP from '../../code/profiles/UnitProfile';
import * as UC from '../../code/profiles/UpgradeCard';

import FactionButtonGroup from './FactionButtonGroup';
import ItemSelector from './ItemSelector';
import RankButtonGroup from './RankButtonGroup';
import UnitSelector from './UnitSelector';

import { Telemetry } from '../../tools/Telemetry';

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

class ProfileSelectorDialog extends React.Component<ProfileSelectorDialogProps, ProfileSelectorDialogState> {
    #units: Array<UP.UnitProfile>;

    constructor(props : ProfileSelectorDialogProps) {
        super(props);
        this.#units = UP.getUnits();
        this.state = this.getNewStateObject();
    }

    private getMaxCompatibleWeapons(unit: UP.UnitProfile) : number {
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

    private getNewStateObject(
        faction: UP.Faction | null = null,
        rank: UP.Rank | null = null,
        unit: UP.UnitProfile | null = null,
        weapons: Array<UP.Weapon> | null = null,
        upgrades: Array<UC.Upgrade> | null = null
            ) : ProfileSelectorDialogState {
        const newFaction = faction !== null ? faction : (this.state?.faction ? this.state.faction : UP.Faction.rebel);
        const newRank = rank !== null ? rank : (this.state?.rank ? this.state.rank : UP.Rank.commander);
        const newUnit = (unit !== null && unit.faction === newFaction && unit.rank === newRank) ? unit :
            (unit === null && newFaction == this.state?.faction && newRank == this.state?.rank && this.state?.unit ? this.state.unit : this.getFirstUnit(newFaction, newRank));
        const newWeapons = weapons !== null ? weapons : (newUnit === this.state?.unit ? this.state.weapons : []);
        const newUpgrades = upgrades !== null ? upgrades : (newUnit === this.state?.unit ? this.state.upgrades : []);

        return {
            units: this.getFilteredUnits(newFaction, newRank),
            faction: newFaction,
            rank: newRank,
            unit: newUnit,
            weapons: newWeapons,
            weaponSelectionCount: Math.min(this.getMaxCompatibleWeapons(newUnit), newUnit.keywords?.arsenal === undefined ? 1 : newUnit.keywords.arsenal),
            upgrades: newUpgrades
        };
    }

    private getFilteredUnits(faction: UP.Faction, rank: UP.Rank) : Array<UP.UnitProfile> {
        return this.#units.filter(profile => profile.faction == faction && profile.rank == rank);
    }

    private getFilteredUpgradeTypes() : Array<UP.UnitUpgrade> {
        const filtered = this.state.unit.upgrades?.filter(u =>
            UC.getUpgrades().filter(ufilter => ufilter.type === u && this.isAvailable(ufilter)).length > 0
        );
        return filtered ? filtered : [];
    }

    private onFactionChange = (newFaction: UP.Faction) => {
        const newState = this.getNewStateObject(newFaction);
        this.setState(newState);
    }

    private onRankChange = (newRank: UP.Rank) => {
        const newState = this.getNewStateObject(undefined, newRank);
        this.setState(newState);
    }

    private onUnitChange = (unit: UP.UnitProfile | null) => {
        const newState = this.getNewStateObject(undefined, undefined, unit, undefined, undefined);
        this.setState(newState);
    }

    private onWeaponChange = (index: number, weapon: UP.Weapon | null) => {
        const newWeapons: Array<UP.Weapon> = [];
        this.state.weapons.forEach((w, i) => {
            // not copying the element at index so that it can be removed if desired
            if(i !== index) {
                newWeapons[i] = w;
            }
        });

        if(weapon && !newWeapons.includes(weapon)) {
            newWeapons[index] = weapon;
        }

        const newState = this.getNewStateObject(undefined, undefined, undefined, newWeapons, undefined);
        this.setState(newState);
    }

    private onUpgradeChange = (index: number, upgrade: UC.Upgrade | null) => {
        const newUpgrades: Array<UC.Upgrade> = [];
        this.state.upgrades.forEach((u, i) => {
            // not copying the element at index so that it can be removed if desired
            if(i !== index) {
                newUpgrades[i] = u;
            }
        });

        if(upgrade) {
            newUpgrades[index] = upgrade;
        }

        const newState = this.getNewStateObject(undefined, undefined, undefined, undefined, newUpgrades);
        this.setState(newState);
    }

    private onApplyChanges = () => {
        this.props.applyProfile(this.state.unit, this.state.weapons, this.state.upgrades);
        $('#' + this.props.id + '-closeButton').trigger('click');
    }

    private getFirstUnit(faction: UP.Faction, rank: UP.Rank) : UP.UnitProfile {
        const units = this.#units.filter(profile =>
            profile.faction === faction &&
            profile.rank === rank);

        // if the result is undefined, we have a data problem
        if(units[0] === undefined) {
            Telemetry.logError("ProfileSelectorDialog.tsx", "getFirstUnit", "Unit not found");
        }
        return units[0];
    }

    private isAvailable(upgrade: UC.Upgrade, index?: number) : boolean {
        if(!AL.isUpgradeInAllowList(upgrade, this.props.upgradeAllowListName)) {
            return false;
        }

        if(index !== undefined) {
            let duplicate = false;
            this.state.upgrades.forEach((u, i) => {
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

            if(r.faction && r.faction !== this.state.faction) {
                match = false;
            }

            if(r.unit && (r.unit !== this.state.unit.name) && ((r.unit + " *") !== this.state.unit.name)) {
                match = false;
            }

            if(r.type && r.type !== this.state.unit.unitType) {
                match = false;
            }

            if(r.rank && r.rank !== this.state.unit.rank) {
                match = false;
            }

            if(r.upgrade && !(this.state?.unit.upgrades && this.state.unit.upgrades.includes(r.upgrade))) {
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

    private renderWeapons(count: number, condition: boolean) : JSX.Element | null {
        const children: Array<JSX.Element> = [];

        for(let i = 0; i < count && condition; i++) {
            children.push(
                <div key={this.props.id + "-weapon-" + i} className="row justify-content-center my-2">
                    <ItemSelector<UP.Weapon>
                        id={this.props.id + "-weapon-" + i}
                        dataIndex={i}
                        items={this.state.unit.weapons}
                        includeBlankItem={true}
                        selectedItem={this.state.weapons[i]}
                        onItemChange={this.onWeaponChange}
                    />
                </div>);
        }

        return children.length === 0 ? null :
            (<div>
                {children}
            </div>);
    }

    render() : JSX.Element {
        return (
            <div className="modal fade" id={this.props.id} tabIndex={-1} aria-labelledby={this.props.id + "ModalLabel"} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="{this.props.id + ModalLabel}">{this.props.upgradeAllowListName === AL.AllowListName.attack ? "Attack" : "Defense"} profile</h5>
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
                                    <UnitSelector
                                        id={this.props.id + "-unit"}
                                        units={this.state.units}
                                        selectedUnit={this.state.unit}
                                        onUnitChange={this.onUnitChange}
                                    />
                                </div>{
                                    this.renderWeapons(this.state.weaponSelectionCount, this.props.upgradeAllowListName === AL.AllowListName.attack)
                                }{
                                    this.getFilteredUpgradeTypes().map((utype, i) =>
                                        <div key={i} className="row justify-content-center my-2">
                                            <img className={utype + "-upgrade-img"}></img>
                                            <ItemSelector<UC.Upgrade>
                                                id={this.props.id + "-" + i + "-upgrade"}
                                                dataIndex={i}
                                                includeBlankItem={true}
                                                items={UC.getUpgrades().filter((ufilter) => ufilter.type === utype && this.isAvailable(ufilter, i))}
                                                selectedItem={this.state.upgrades[i]}
                                                onItemChange={this.onUpgradeChange}
                                            />
                                        </div>
                                    )
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

export default ProfileSelectorDialog;
