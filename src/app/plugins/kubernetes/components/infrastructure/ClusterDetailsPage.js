import React from 'react'
import Tabs from 'core/components/tabs/Tabs'
import Tab from 'core/components/tabs/Tab'

import ClusterInfo from './ClusterInfo'
import ClusterNodes from './ClusterNodes'

const ClusterDetailsPage = () => (
  <Tabs>
    <Tab value="info" label="Info"><ClusterInfo /></Tab>
    <Tab value="nodes" label="Nodes"><ClusterNodes /></Tab>
  </Tabs>
)

export default ClusterDetailsPage
