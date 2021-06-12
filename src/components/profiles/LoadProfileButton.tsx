import '../../css/LoadProfileButton.css';

import React from 'react';

type LoadProfileButtonProps = {
    dialogId: string,
    tooltip: string,
};

class LoadProfileButton extends React.Component<LoadProfileButtonProps> {
    constructor(props : LoadProfileButtonProps) {
        super(props);
    }

    render() : JSX.Element {
        return (
            <button
                className="btn btn-light border rounded-lg load-profile-button mx-2 my-auto"
                title={this.props.tooltip}
                data-toggle="modal"
                data-target={"#" + this.props.dialogId}>
            </button>
        );
    }
}

export default LoadProfileButton;
