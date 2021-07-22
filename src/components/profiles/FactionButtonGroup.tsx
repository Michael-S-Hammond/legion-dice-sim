import React from 'react';

import * as UP from '../../code/profiles/UnitProfile';

type FactionButtonGroupProps = {
    faction: UP.Faction,
    onFactionChange: (faction: UP.Faction) => void,
}

function FactionButtonGroup(props: FactionButtonGroupProps) : JSX.Element {
    const onFactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFaction = e.target.value as UP.Faction;
        props.onFactionChange(newFaction);
    }

    return (
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-light faction-label active" title="Rebel">
                <input
                    type="radio"
                    name="faction"
                    id={UP.Faction.rebel}
                    value={UP.Faction.rebel}
                    autoComplete="off"
                    onChange={onFactionChange}
                    checked={props.faction === UP.Faction.rebel}/>
                <img className='rebel-faction-img mx-1'></img>
            </label>
            <label className="btn btn-light faction-label" title="Empire">
                <input
                    type="radio"
                    name="faction"
                    id={UP.Faction.empire}
                    value={UP.Faction.empire}
                    autoComplete="off"
                    onChange={onFactionChange}
                    checked={props.faction === UP.Faction.empire}/>
                <img className='empire-faction-img mx-1'></img>
            </label>
            <label className="btn btn-light faction-label" title="Republic">
                <input
                    type="radio"
                    name="faction"
                    id={UP.Faction.republic}
                    value={UP.Faction.republic}
                    autoComplete="off"
                    onChange={onFactionChange}
                    checked={props.faction === UP.Faction.republic}/>
                <img className='republic-faction-img mx-1'></img>
            </label>
            <label className="btn btn-light faction-label" title="Separatist">
                <input
                    type="radio"
                    name="faction"
                    id={UP.Faction.separatist}
                    value={UP.Faction.separatist}
                    autoComplete="off"
                    onChange={onFactionChange}
                    checked={props.faction === UP.Faction.separatist}/>
                <img className='separatist-faction-img mx-1'></img>
            </label>
        </div>
    );
}

export default FactionButtonGroup;
