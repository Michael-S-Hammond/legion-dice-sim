import React from 'react';

type DefenseProfileDialogProps = {
    id: string
};

class DefenseProfileDialog extends React.Component<DefenseProfileDialogProps> {
    constructor(props : DefenseProfileDialogProps) {
        super(props);
    }

    render() : JSX.Element {
        return (
            <div className="modal fade" id={this.props.id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Defense profile</h5>
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

export default DefenseProfileDialog;
