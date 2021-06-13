import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as UP from '../../../code/profiles/UnitProfile';
import RankButtonGroup from '../../../components/profiles/RankButtonGroup';

describe('FactionButtonGroup', () => {
    it('matches the snapshot', () => {
        const onRankChange = jest.fn();
        const rank = UP.Rank.commander;

        const group = shallow(<RankButtonGroup
                rank={rank}
                onRankChange={onRankChange}
            ></RankButtonGroup>);
        const snapshot = shallowToJson(group);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles being clicked', () => {
        let rank = UP.Rank.commander;
        const onRankChange = jest.fn((newRank) => {
            rank = newRank;
        });

        const wrapper = shallow(<RankButtonGroup
            rank={rank}
            onRankChange={onRankChange}
        ></RankButtonGroup>);
        wrapper.find('#' + UP.Rank.specialForces).simulate('change', { target: { value: String(UP.Rank.specialForces) }});

        expect(onRankChange).toHaveBeenCalledTimes(1);
        expect(rank).toEqual(UP.Rank.specialForces);
    })
});
