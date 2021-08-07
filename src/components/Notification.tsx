import '../css/Notification.css';

import React from 'react';

type NotificationProps = {
    message: string;
}

function Notification(props: NotificationProps) : JSX.Element {
    return (
        <div className="alert alert-secondary alert-dismissible fade show mb-0" role="alert">
            {props.message}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
}

export default Notification;
