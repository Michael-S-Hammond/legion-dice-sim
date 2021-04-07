import React from 'react';

import { create } from 'react-test-renderer';

import Header from '../../components/Header';

describe('Header', () => {
    it('matches the snapshot', () => {
        const snapshot = create(<Header></Header>)
        expect(snapshot.toJSON()).toMatchSnapshot();
    });
});
