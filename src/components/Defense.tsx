import React from 'react';

import * as T from '../code/Types';
import * as AS from './AppStateManager';

import DefenseAbilities from './DefenseAbilities';
import DefenseTokens from './DefenseTokens';
import LoadProfileButton from './profiles/LoadProfileButton';
import SurgeDieSelector from './SurgeDieSelector';

type DefenseProps = {
    profileDialogId: string,
    showSimpleView: boolean,
    input: T.DefenseInput,
    eventHandlers: AS.AppStateDefenseEventHandlers,
}

class Defense extends React.Component<DefenseProps> {
    constructor(props : DefenseProps) {
        super(props);
    }

    private handleCoverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCover = Number(e.target.value);
        this.props.eventHandlers.handleCoverChange(newCover);
    }

    render() : JSX.Element {
        return (
            <div>
                <h2 className="d-flex justify-content-center my-2">Defense
                    <LoadProfileButton
                        dialogId={this.props.profileDialogId}
                        tooltip='Load defense profile'></LoadProfileButton>
                </h2>
                <div className="d-flex justify-content-center my-2">
                    <SurgeDieSelector
                        color={this.props.input.dieColor}
                        surge={this.props.input.surge}
                        onClick={this.props.eventHandlers.changeDie}></SurgeDieSelector>
                </div>
                <DefenseTokens
                    showSimplifiedView={this.props.showSimpleView}
                    tokens={this.props.input.tokens}
                    eventHandlers={this.props.eventHandlers}
                    ></DefenseTokens>
                <div className="d-flex justify-content-center my-2">
                    <span className="mx-2 my-auto drop-down-label">Cover:</span>
                    <select value={this.props.input.cover} className="rounded-lg mr-4 px-2"
                        onChange={this.handleCoverChange}>
                        <option value="1">None</option>
                        <option value="2">Light</option>
                        <option value="3">Heavy</option>
                    </select>
                </div>
                <DefenseAbilities
                    showSimpleView={this.props.showSimpleView}
                    inputs={this.props.input}
                    eventHandlers={this.props.eventHandlers}
                    ></DefenseAbilities>
            </div>
        );
    }
}

export default Defense;
