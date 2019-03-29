// Note the name of this file has X.test.js. Jest looks for any files with this pattern.
import './enzyme.config.js'
import React from 'react'
import { mount } from 'enzyme'
import Optimizations from '../src/components/Application/Options/Optimizations'


const startProperties = {
    'optimizations': ['none', 'short'],
    'activeOpt': 'none'
};

function testButtonValues() {
    const opts = mount((
        <Optimizations  optimizations={startProperties.optimizations}
                        activeUnit={startProperties.activeUnit}
                        updateStateVar={jest.fn()}/>
    ));

    let actual = [];
    opts.find('Button').map((element) => actual.push(element.prop('value')));
    let expected = startProperties.optimizations;

    expect(actual.sort()).toEqual(expected.sort());
}

/* Deep render (mount) Units to be able to test the properties of the Buttons
 * that get rendered inside of it.
 */
test('Check to see if a Button is rendered for each optimizations', testButtonValues);


function testInitialActiveButton() {
    const opts = mount((
        <Optimizations  optimizations={startProperties.optimizations}
                        activeOpt={startProperties.activeOpt}
                        updateStateVar={jest.fn()}/>
    ));

    let actualButtons = [];
    opts.find('Button').map((button) => actualButtons.push(button));

    for (let button of actualButtons) {

        if (button.prop('value') === startProperties.activeOpt){
            expect(button.prop('active')).toEqual(true);
        }
        else {
            expect(button.prop('active')).toEqual(false);
        }
    }
}

test('Check to see if the correct button is initially made active', testInitialActiveButton);
