import React from 'react';

import * as UP from '../../code/profiles/UnitProfile';

type RankButtonGroupProps = {
    rank: UP.Rank,
    onRankChange: (rank: UP.Rank) => void,
}

function RankButtonGroup(props: RankButtonGroupProps) {
    const onRankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRank = e.target.value as UP.Rank;
        props.onRankChange(newRank);
    };

    return (
        <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-light rank-label active" title="Commander">
                <input
                    type="radio"
                    name="rank"
                    id={UP.Rank.commander}
                    value={UP.Rank.commander}
                    autoComplete="off"
                    onChange={onRankChange}
                    checked={props.rank === UP.Rank.commander}/>
                <img className='commander-rank-img mx-1'></img>
            </label>
            <label className="btn btn-light rank-label" title="Operative">
                <input
                    type="radio"
                    name="rank"
                    id={UP.Rank.operative}
                    value={UP.Rank.operative}
                    autoComplete="off"
                    onChange={onRankChange}
                    checked={props.rank === UP.Rank.operative}/>
                <img className='operative-rank-img mx-1'></img>
            </label>
            <label className="btn btn-light rank-label" title="Corps">
                <input
                    type="radio"
                    name="rank"
                    id={UP.Rank.corps}
                    value={UP.Rank.corps}
                    autoComplete="off"
                    onChange={onRankChange}
                    checked={props.rank === UP.Rank.corps}/>
                <img className='corps-rank-img mx-1'></img>
            </label>
            <label className="btn btn-light rank-label" title="Special Forces">
                <input
                    type="radio"
                    name="rank"
                    id={UP.Rank.specialForces}
                    value={UP.Rank.specialForces}
                    autoComplete="off"
                    onChange={onRankChange}
                    checked={props.rank === UP.Rank.specialForces}/>
                <img className='specialforces-rank-img mx-1'></img>
            </label>
            <label className="btn btn-light rank-label" title="Support">
                <input
                    type="radio"
                    name="rank"
                    id={UP.Rank.support}
                    value={UP.Rank.support}
                    autoComplete="off"
                    onChange={onRankChange}
                    checked={props.rank === UP.Rank.support}/>
                <img className='support-rank-img mx-1'></img>
            </label>
            <label className="btn btn-light rank-label" title="Heavy">
                <input
                    type="radio"
                    name="rank"
                    id={UP.Rank.heavy}
                    value={UP.Rank.heavy}
                    autoComplete="off"
                    onChange={onRankChange}
                    checked={props.rank === UP.Rank.heavy}/>
                <img className='heavy-rank-img mx-1'></img>
            </label>
        </div>
    );
}

export default RankButtonGroup;
