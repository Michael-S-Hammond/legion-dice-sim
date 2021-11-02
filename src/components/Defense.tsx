import React from 'react';

import * as T from '../code/Types';
import * as SSM from './SimulatorStateManager';

import DefenseAbilities from './DefenseAbilities';
import DefenseTokens from './DefenseTokens';
import LoadProfileButton from './profiles/LoadProfileButton';
import SurgeDieSelector from './SurgeDieSelector';

type DefenseProps = {
    profileDialogId: string,
    showSimpleView: boolean,
    input: T.DefenseInput,
    eventHandlers: SSM.SimulatorStateDefenseEventHandlers,
}

function Defense(props: DefenseProps) : JSX.Element {
    const handleCoverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCover = (e.target.value) as unknown as T.Cover;
        props.eventHandlers.handleCoverChange(newCover);
    }

    return (
        <div>
            <h2 className="d-flex justify-content-center my-2">Defense
                <LoadProfileButton
                    dialogId={props.profileDialogId}
                    tooltip='Load defense profile'></LoadProfileButton>
            </h2>
            <div className="d-flex justify-content-center my-2">
                <SurgeDieSelector
                    color={props.input.dieColor}
                    surge={props.input.surge}
                    onClick={props.eventHandlers.changeDie}></SurgeDieSelector>
            </div>
            <DefenseTokens
                showSimplifiedView={props.showSimpleView}
                tokens={props.input.tokens}
                eventHandlers={props.eventHandlers}
                ></DefenseTokens>
            <div className="d-flex justify-content-center my-2">
                <span className="mx-2 my-auto drop-down-label">Cover:</span>
                <select value={props.input.cover} className="rounded-lg mr-4 px-2"
                    onChange={handleCoverChange}>
                    <option value="none">None</option>
                    <option value="light">Light</option>
                    <option value="heavy">Heavy</option>
                </select>
            </div>
            <DefenseAbilities
                showSimpleView={props.showSimpleView}
                inputs={props.input}
                eventHandlers={props.eventHandlers}
                ></DefenseAbilities>
        </div>
    );
}

export default Defense;
