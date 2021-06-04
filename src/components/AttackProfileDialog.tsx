import React from 'react';

type AttackProfileDialogProps = {
    id: string
};

class AttackProfileDialog extends React.Component<AttackProfileDialogProps> {
    constructor(props : AttackProfileDialogProps) {
        super(props);
    }

    render() : JSX.Element {
        return (
            <div className="modal fade" id={this.props.id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attack profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AttackProfileDialog;
