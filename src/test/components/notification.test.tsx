import { create } from 'react-test-renderer';

import Notification from '../../components/Notification';

describe('Notification', () => {
    it('matches the snapshot', () => {
        const snapshot = create(<Notification message='This is a test.'></Notification>)
        expect(snapshot.toJSON()).toMatchSnapshot();
    });
});
