import '../css/App.css';

import * as MJS from "mathjs";
import React from 'react';

import * as DU from '../code/DiceRoller';
import * as T from '../code/Types';
import * as AS from './AppStateManager';

import Attack from './Attack';
import Combat from './Combat';
import Defense from './Defense';
import DiceResults from './DiceResults';
// import Notification from './Notification';
import Header from './Header';

import { Telemetry } from '../tools/Telemetry';

class App extends React.Component<any, AS.AppState> { // eslint-disable-line @typescript-eslint/no-explicit-any
  private _stateManager: AS.AppStateManager;
  private _diceResultsRef: React.RefObject<DiceResults>;
  private _telemetry: Telemetry;

  constructor(props: any) { // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    super(props);

    this._stateManager = new AS.AppStateManager((newState: AS.AppState) => this.setState(newState));
    this.state = this._stateManager.state;

    this._diceResultsRef = React.createRef();
    this._telemetry = new Telemetry();
  }

  private handleShowExpectedRangeChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const show = event.target.checked;
    this._stateManager.behaviorEventHandlers.handleShowExpectedRangeChanged(show);
    this._diceResultsRef.current?.forceChartUpdate();
  }

  private handleSimplifiedViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const show = event.target.checked;
    this._stateManager.behaviorEventHandlers.handleShowSimplifiedViewChange(show);
  }

  private handleDiceCountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const count = Number(event.target.value);
    this._stateManager.behaviorEventHandlers.handleDiceCountChange(count);
  }

  private rollAttackDice() {
    const diceRoller = new DU.DiceRoller();

    performance.mark('start roll');
    const outputs = diceRoller.simulateAttacks(
      this.state.diceRolls,
      this.state.inputs
    );
    performance.mark('end roll');

    performance.measure('roll duration', 'start roll', 'end roll');
    const rollDuration = MJS.round(performance.getEntriesByName('roll duration', 'measure')[0].duration, 3);
    this._telemetry.trackEvent("RollDice", {
      Rolls: this.state.diceRolls,
      Duration: rollDuration,
      SimpleView: this.state.view.showSimpleView,
    });

    this._diceResultsRef.current?.scrollIntoView();
    this._diceResultsRef.current?.forceChartUpdate();

    this._stateManager.updateOutputs(outputs);
  }

  render() : JSX.Element {
    return (
      <main role="main">
        <Header></Header>
        {/* <Notification message='Rerolls received a substantial update. More coming soon.'></Notification> */}
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2 mt-3">
              <div key='showSimplifiedViewToggle-abilitytoggle' className="d-flex justify-content-center my-auto custom-control custom-switch">
                <input key='showSimplifiedViewToggle-toggle-input' type="checkbox"
                  className='custom-control-input my-auto'
                  id="showSimplifiedViewToggle"
                  checked={this.state.view.showSimpleView}
                  onChange={this.handleSimplifiedViewChange}></input>
                <label key='showSimplifiedViewToggle-toggle-label'
                  className='custom-control-label drop-down-label mx-2 my-auto'
                  htmlFor="showSimplifiedViewToggle"
                >Simplified View</label>
              </div>
            </div>
          </div>
          <div className="row">
            <div className={`col-md-5 offset-md-1 col-lg-4 ${this.state.view.showSimpleView ? 'offset-lg-2' : 'offset-lg-0'}`}>
              <Attack
                showSimpleView={this.state.view.showSimpleView}
                input={this.state.inputs.offense}
                eventHandlers={this._stateManager.attackEventHandlers}
              ></Attack>
            </div>
            <div className="col-md-5 col-lg-4">
              <Defense
                showSimpleView={this.state.view.showSimpleView}
                input={this.state.inputs.defense}
                eventHandlers={this._stateManager.defenseEventHandlers}
              ></Defense>
            </div>
            <div className={`col-md-6 offset-md-3 col-lg-4 offset-lg-0 ${this.state.view.showSimpleView ? 'collapse' : 'collapse.show'}`}>
              <Combat
                input={this.state.inputs.combat}
                eventHandlers={this._stateManager.combatEventHandlers}
              ></Combat>
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-center my-3">
            <span className="mx-2 my-auto drop-down-label">Rolls:</span>
            <select value={this.state.diceRolls} className="rounded-lg mr-4 px-2"
              onChange={this.handleDiceCountChange}>
              <option value="1">1</option>
              <option value="10000">10,000</option>
            </select>
            <button className="btn btn-secondary border border-secondary rounded-lg mx-2 px-3 roll-button"
              onClick={() => this.rollAttackDice()}>Roll</button>
            <div key={`showExpectedRangeToggle-abilitytoggle`} className="d-flex justify-content-center my-auto custom-control custom-switch">
              <input key={`showExpectedRangeToggle-toggle-input`} type="checkbox"
                className={`custom-control-input my-auto ${this.state.resultsVisibility === T.ResultOutput.Graph ? 'collapse.show' : 'collapse'}`}
                id="showExpectedRangeToggle"
                checked={this.state.view.showExpectedRange}
                onChange={this.handleShowExpectedRangeChanged}></input>
              <label key={`showExpectedRangeToggle-toggle-label`}
                className={`custom-control-label drop-down-label mx-2 my-auto ${this.state.resultsVisibility === T.ResultOutput.Graph ? 'collapse.show' : 'collapse'}`}
                htmlFor="showExpectedRangeToggle"
              >Show expected range</label>
            </div>
          </div>
          <DiceResults
            ref={this._diceResultsRef}
            results={this.state.outputs}
            visibility={this.state.resultsVisibility}
            showExpectedRange={this.state.view.showExpectedRange}
          ></DiceResults>
        </div>
      </main>
    );
  }
}

export default App;
