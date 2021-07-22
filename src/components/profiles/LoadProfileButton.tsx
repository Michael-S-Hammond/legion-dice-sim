import '../../css/LoadProfileButton.css';

import React from 'react';

type LoadProfileButtonProps = {
    dialogId: string,
    tooltip: string,
};

function LoadProfileButton(props : LoadProfileButtonProps) {
    return (
        <button
            className="btn btn-light border rounded-lg load-profile-button mx-2 my-auto"
            title={props.tooltip}
            data-toggle="modal"
            data-target={"#" + props.dialogId}>
        </button>
    );
}

export default LoadProfileButton;
