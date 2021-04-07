import React from 'react';

jest.mock('highcharts');

import { shallow } from 'enzyme';
import { Json, shallowToJson } from 'enzyme-to-json';

import * as T from '../../code/Types';
import DiceResults from '../../components/DiceResults';

jest.mock('highcharts/modules/exporting');
jest.mock('highcharts/modules/offline-exporting');

const removeChartFromSnapshot = (json: Json) : Json => {
    if(json.props['id'] === 'chartContainer') {
        return {
            ...json,
            children: [{
                type: 'Highchart',
                children: [],
                props: {},
                $$typeof: json.children[0].$$typeof,
            }]
        };
    }
    return json;
};

function createEmptyOutput() : T.CombinedAttackOutput {
    return {
        firstAttack: {
            attack: {
                criticals: 0,
                hits: 0,
                surges: 0,
                misses: 0,
            },
            defense: {
                blocks: 0,
                surges: 0,
                blanks: 0,
                forcedSaves: 0,
                wounds: 0,
            },
        },
        summary: {
            critical: [],
            hit: [],
            attackSurge: [],
            attackCount: 0,
            blocks: [],
            defenseSurge: [],
            forcedSaves: [],
            wounds: [],
            forcedSaveStats: {
                mean: 0,
                median: 0,
                stddev: 0,
            },
            woundStats: {
                mean: 0,
                median: 0,
                stddev: 0,
            },
        },
    };
}

describe('DiceResults', () => {
    it('matches the snapshot when not visible', () => {
        const output : T.CombinedAttackOutput = createEmptyOutput();

        const diceResults = shallow(<DiceResults
            showExpectedRange={true}
            visibility={T.ResultOutput.None}
            results={output}
            ></DiceResults>);

        const snapshot = shallowToJson(diceResults, { map: removeChartFromSnapshot });
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot when showing single result', () => {
        const output : T.CombinedAttackOutput = createEmptyOutput();

        const diceResults = shallow(<DiceResults
            showExpectedRange={true}
            visibility={T.ResultOutput.Single}
            results={output}
            ></DiceResults>);

        const snapshot = shallowToJson(diceResults, { map: removeChartFromSnapshot });
        expect(snapshot).toMatchSnapshot();
    });

    it('matches the snapshot when showing graph result', () => {
        const output : T.CombinedAttackOutput = createEmptyOutput();

        const diceResults = shallow(<DiceResults
            showExpectedRange={true}
            visibility={T.ResultOutput.Graph}
            results={output}
            ></DiceResults>);

        const snapshot = shallowToJson(diceResults, { map: removeChartFromSnapshot });
        expect(snapshot).toMatchSnapshot();
    });
});
