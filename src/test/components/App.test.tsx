import React from 'react';

import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import App from 'components/App';

describe('App', () => {
    it('matches the snapshot', () => {
        const app = shallow(<App/>);
        const snapshot = shallowToJson(app);
        expect(snapshot).toMatchSnapshot();
    });

    it('handles simple view', () => {
        const app = shallow(<App/>);
        app.find('#showSimplifiedViewToggle').simulate('change', { target: { checked: true } });

        const snapshot = shallowToJson(app);
        expect(snapshot).toMatchSnapshot();
    });
});
