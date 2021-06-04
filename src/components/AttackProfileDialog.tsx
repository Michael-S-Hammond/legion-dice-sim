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
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-light active">
                                    <input type="radio" name="faction" id="rebel" autoComplete="off" checked/>Rebel
                                </label>
                                <label className="btn btn-light ">
                                    <input type="radio" name="faction" id="empire" autoComplete="off"/>Empire
                                </label>
                                <label className="btn btn-light ">
                                    <input type="radio" name="faction" id="republic" autoComplete="off"/>Republic
                                </label>
                                <label className="btn btn-light ">
                                    <input type="radio" name="faction" id="separatist" autoComplete="off"/>Separatist
                                </label>
                            </div>
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-light active">
                                    <input type="radio" name="rank" id="commander" autoComplete="off" checked/>Commander
                                </label>
                                <label className="btn btn-light ">
                                    <input type="radio" name="rank" id="operative" autoComplete="off"/>Operative
                                </label>
                                <label className="btn btn-light ">
                                    <input type="radio" name="rank" id="corps" autoComplete="off"/>Corps
                                </label>
                                <label className="btn btn-light ">
                                    <input type="radio" name="rank" id="specialForces" autoComplete="off"/>Special Forces
                                </label>
                                <label className="btn btn-light ">
                                    <input type="radio" name="rank" id="support" autoComplete="off"/>Support
                                </label>
                                <label className="btn btn-light ">
                                    <input type="radio" name="rank" id="heavy" autoComplete="off"/>Heavy
                                </label>
                            </div>
                            <div>
                                <select id="unitSelect">
                                    <option value="0" selected>Luke Skywalker</option>
                                    <option value="1">Leia Organa</option>
                                    <option value="2">Han Solo</option>
                                </select>
                            </div>
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
