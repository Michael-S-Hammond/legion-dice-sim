import '../css/ProfileDialog.css';

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
                <div className="modal-dialog modal-dialog-centered modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Attack profile</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex justify-content-center my-2 btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-light faction-label active">
                                    <input type="radio" name="faction" id="rebel" autoComplete="off" checked/><img className='rebel-faction-img mx-1'></img>
                                </label>
                                <label className="btn btn-light faction-label">
                                    <input type="radio" name="faction" id="empire" autoComplete="off"/><img className='empire-faction-img mx-1'></img>
                                </label>
                                <label className="btn btn-light faction-label">
                                    <input type="radio" name="faction" id="republic" autoComplete="off"/><img className='republic-faction-img mx-1'></img>
                                </label>
                                <label className="btn btn-light faction-label">
                                    <input type="radio" name="faction" id="separatist" autoComplete="off"/><img className='separatist-faction-img mx-1'></img>
                                </label>
                            </div>
                            <div className="d-flex justify-content-center my-2 btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-light rank-label active" title="Commander">
                                    <input type="radio" name="rank" id="commander" autoComplete="off" checked/><img className='commander-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Operative">
                                    <input type="radio" name="rank" id="operative" autoComplete="off"/><img className='operative-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Corps">
                                    <input type="radio" name="rank" id="corps" autoComplete="off"/><img className='corps-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Special Forces">
                                    <input type="radio" name="rank" id="specialForces" autoComplete="off"/><img className='specialforces-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Support">
                                    <input type="radio" name="rank" id="support" autoComplete="off"/><img className='support-rank-img mx-1'></img>
                                </label>
                                <label className="btn btn-light rank-label" title="Heavy">
                                    <input type="radio" name="rank" id="heavy" autoComplete="off"/><img className='heavy-rank-img mx-1'></img>
                                </label>
                            </div>
                            <div className="d-flex justify-content-center my-2">
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
