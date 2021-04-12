import '../css/DiceResults.css';

import React from 'react';
import * as mjs from 'mathjs';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import ExpMod from 'highcharts/modules/exporting';
import OffExpMod from 'highcharts/modules/offline-exporting';

import * as T from '../code/Types'

ExpMod(Highcharts);
OffExpMod(Highcharts);

type DiceResultsProps = {
    results: T.CombinedAttackOutput,
    visibility: T.ResultOutput,
    showExpectedRange: boolean,
};

type DiceResultsState = {
    chartOptions: Highcharts.Options,
};

class DiceResults extends React.Component<DiceResultsProps, DiceResultsState> {
    private rootElementRef: React.RefObject<HTMLDivElement>;

    private critColor = 'rgba(192, 190, 195, 0.8)';
    private hitColor = 'rgba(50, 140, 193, 0.8)';
    private attackSurgeColor = 'rgba(11, 60, 93, 0.8)';
    private forcedSavesColor = 'rgba(14, 19, 21, 0.8)';
    private forcedSavesFillColor = 'rgba(14, 19, 21, 0.4)';
    private blocksColor = 'rgba(216, 108, 35, 0.8)';
    private defenseSurgeColor = 'rgba(255, 225, 0, 0.8)';
    private woundsColor = 'rgba(192, 45, 45, 0.8)';
    private woundsFillColor = 'rgba(192, 45, 45, 0.4)';
    private transparentColor = 'rgba(255, 255, 255, 0)';

    private refreshChart = true;
    private scrollUIIntoView = false;

    constructor(props: DiceResultsProps) {
        super(props);
        this.state = {
            chartOptions: this.createChartOptions(),
        };
        this.rootElementRef = React.createRef();
    }

    private getFirstCritCount(): string {
        return String(this.props.results.firstAttack.attack.criticals);
    }

    private getFirstHitCount(): string {
        return String(this.props.results.firstAttack.attack.hits);
    }

    private getFirstAttackSurgeCount(): string {
        return String(this.props.results.firstAttack.attack.surges);
    }

    private getFirstBlockCount(): string {
        return String(this.props.results.firstAttack.defense.blocks);
    }

    private getFirstDefenseSurgeCount(): string {
        return String(this.props.results.firstAttack.defense.surges);
    }

    private getFirstWoundCount(): string {
        return String(this.props.results.firstAttack.defense.wounds);
    }

    private createChartOptions(): Highcharts.Options {
        const chartData = [
            this.props.results.summary.critical,
            this.props.results.summary.hit,
            this.props.results.summary.attackSurge,
            this.props.results.summary.forcedSaves,
            this.props.results.summary.blocks,
            this.props.results.summary.defenseSurge,
            this.props.results.summary.wounds,
        ];
        const forcedSaveStats = this.props.results.summary.forcedSaveStats;
        const woundStats = this.props.results.summary.woundStats;
        return {
            chart: {
                type: 'spline',
            },
            title: {
                text: undefined,
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                categories: this.getXAxisCategories(),
            },
            yAxis: {
                title: undefined,
            },
            series: [{
                type: 'spline',
                name: 'Crits',
                color: this.critColor,
                visible: false,
                data: chartData[0],
            }, {
                type: 'spline',
                name: 'Hits',
                color: this.hitColor,
                visible: false,
                data: chartData[1],
            }, {
                type: 'spline',
                name: 'Attack Surges',
                color: this.attackSurgeColor,
                visible: false,
                data: chartData[2]
            }, {
                type: 'areaspline',
                name: 'Required Saves',
                color: this.forcedSavesColor,
                fillColor: this.forcedSavesFillColor,
                zoneAxis: 'x',
                zones: this.getZones(forcedSaveStats.mean, forcedSaveStats.stddev),
                data: chartData[3],
            }, {
                type: 'spline',
                name: 'Blocks',
                color: this.blocksColor,
                visible: false,
                data: chartData[4],
            }, {
                type: 'spline',
                name: 'Defense Surges',
                color: this.defenseSurgeColor,
                visible: false,
                data: chartData[5],
            }, {
                type: 'areaspline',
                name: 'Wounds',
                color: this.woundsColor,
                fillColor: this.woundsFillColor,
                zoneAxis: 'x',
                zones: this.getZones(woundStats.mean, woundStats.stddev),
                data: chartData[6],
            }],
            plotOptions: {
                areaspline: {
                    marker: {
                        symbol: 'circle',
                    }
                },
                spline: {
                    marker: {
                        symbol: 'circle',
                    }
                },
            },
        };
    }

    componentDidUpdate() : void{
        if (this.props.visibility === T.ResultOutput.Graph) {
            this.updateChart();
        }
    }

    private getXAxisCategories(): string[] {
        const categories: string[] = [];
        for (let i = 0; i < this.props.results.summary.critical.length; i++) {
            categories.push(String(i));
        }
        return categories;
    }

    private getZones(mean: number, stddev: number) {
        if (this.props.showExpectedRange) {
            return [{
                fillColor: this.transparentColor,
                value: mean - stddev,
            }, {
                value: mean + stddev,
            }, {
                fillColor: this.transparentColor,
            }]
        } else {
            return [{
                fillColor: this.transparentColor,
                value: this.props.results.summary.critical.length,
            }];
        }
    }

    private updateChart() {
        if (this.refreshChart === false) {
            return;
        }

        this.setState({
            chartOptions: this.createChartOptions(),
        });
        this.refreshChart = false;

        this.performScrollIntoView();
    }

    public forceChartUpdate() : void {
        this.refreshChart = true;
    }

    public scrollIntoView() : void {
        this.scrollUIIntoView = true;
    }

    private performScrollIntoView() {
        if (this.scrollUIIntoView) {
            this.rootElementRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        this.scrollUIIntoView = false;
    }

    render() : JSX.Element {
        return (
            <div ref={this.rootElementRef}>
                <div className={`single-result justify-content-center my-3 ${this.props.visibility === T.ResultOutput.Single ? 'collapse.show' : 'collapse'}`}>
                    <img className='crit-result-img mx-1'></img>
                    <span className="die-result">{this.getFirstCritCount()}</span>
                    <img className='hit-result-img mx-1'></img>
                    <span className="die-result">{this.getFirstHitCount()}</span>
                    <img className='attack-surge-result-img mx-1'></img>
                    <span className="die-result">{this.getFirstAttackSurgeCount()}</span>
                </div>
                <div className={`single-result justify-content-center my-3 ${this.props.visibility === T.ResultOutput.Single ? 'collapse.show' : 'collapse'}`}>
                    <img className='block-result-img mx-1'></img>
                    <span className="die-result">{this.getFirstBlockCount()}</span>
                    <img className='defense-surge-result-img mx-1'></img>
                    <span className="die-result">{this.getFirstDefenseSurgeCount()}</span>
                </div>
                <div className={`single-result justify-content-center my-3 ${this.props.visibility === T.ResultOutput.Single ? 'collapse.show' : 'collapse'}`}>
                    <span className="die-result">Wounds: {this.getFirstWoundCount()}</span>
                </div>
                <div id="chartContainer" className={`my-3 mx-auto ${this.props.visibility === T.ResultOutput.Graph ? 'collapse.show' : 'collapse'}`}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={this.state.chartOptions}
                    ></HighchartsReact>
                </div>
                <div className={`row ${this.props.visibility === T.ResultOutput.Graph ? 'collapse.show' : 'collapse'}`}>
                    <div className="col-md-3 offset-md-3 my-3">
                        <h3 className="stats-header">Required Blocks</h3>
                        <div>
                            <span className="stats-label">Median: </span>
                            <span>{this.props.results.summary.forcedSaveStats.median}</span>
                        </div>
                        <div>
                            <span className="stats-label">Mean: </span>
                            <span>{mjs.round(this.props.results.summary.forcedSaveStats.mean, 3)}</span>
                        </div>
                        <div>
                            <span className="stats-label">Standard Deviation: </span>
                            <span>{mjs.round(this.props.results.summary.forcedSaveStats.stddev, 3)}</span>
                        </div>
                    </div>
                    <div className="col-md-3 my-3">
                        <h3 className="stats-header">Wounds</h3>
                        <div>
                            <span className="stats-label">Median: </span>
                            <span>{this.props.results.summary.woundStats.median}</span>
                        </div>
                        <div>
                            <span className="stats-label">Mean: </span>
                            <span>{mjs.round(this.props.results.summary.woundStats.mean, 3)}</span>
                        </div>
                        <div>
                            <span className="stats-label">Standard Deviation: </span>
                            <span>{mjs.round(this.props.results.summary.woundStats.stddev, 3)}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DiceResults;
