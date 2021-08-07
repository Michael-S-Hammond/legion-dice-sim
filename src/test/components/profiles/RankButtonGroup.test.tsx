import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import * as UP from '../../../code/profiles/UnitProfile';
import RankButtonGroup from '../../../components/profiles/RankButtonGroup';

describe('RankButtonGroup', () => {
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
        function onRankChange(newRank: UP.Rank) {
            rank = newRank;
        }

        render(<RankButtonGroup
            rank={rank}
            onRankChange={onRankChange}
        ></RankButtonGroup>);

        userEvent.click(screen.getByTitle('Special Forces'));
        expect(rank).toEqual(UP.Rank.specialForces);
    })
});
