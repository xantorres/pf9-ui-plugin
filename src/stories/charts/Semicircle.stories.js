import React from 'react'
import SemiCircle from 'core/components/dashboardGraphs/SemiCircle'
import { addStoriesFromModule } from '../helpers'

const addStories = addStoriesFromModule(module)

addStories('Charts', {
  'SemiCircle': () => (
    <SemiCircle
      label="0.7 GHz used / 13.2 GHz"
      percentage={70} />
  )
})
