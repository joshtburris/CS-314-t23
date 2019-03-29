import './enzyme.config.js'
import React from 'react'
import { shallow } from 'enzyme'
import Options from '../src/components/Application/Options/Options'
import Units from '../src/components/Application/Options/Units'
import Optimizations from '../src/components/Application/Options/Optimizations'


const startProperties = {
  'options': {
    'units': {'miles':3959, 'kilometers':6371},
    'optimizations': 'none',
    'activeUnit': 'miles'
  },
  'config': {'optimizations': ['none', 'short']},
  'updateStateVar' : () => {}
};

function testRender() {
  const options = shallow(<Options options={startProperties.options}
                                   config={startProperties.config}
                                   updateStateVar={startProperties.updateStateVar}/>);

  expect(options.contains(<Units options={startProperties.options}
                                 activeUnit={startProperties.options.activeUnit}
                                 updateStateVar={startProperties.updateStateVar}/>)).toEqual(true);
  expect(options.contains(<Optimizations  optimizations={startProperties.config.optimizations}
                                          activeOpt={startProperties.options.optimizations}
                                          updateStateVar={startProperties.updateStateVar}/>)).toEqual(true);
}

test('Check to see if a Units component is rendered', testRender);