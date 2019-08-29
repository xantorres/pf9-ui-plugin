import React, { useCallback, useState } from 'react'
import { deploymentActions } from 'k8s/components/pods/actions'
import createCRUDComponents from 'core/helpers/createCRUDComponents'
import { emptyObj } from 'utils/fp'
import ClusterPicklist from 'k8s/components/common/ClusterPicklist'
import useDataLoader from 'core/hooks/useDataLoader'

const ListPage = ({ ListContainer }) => {
  return () => {
    const [params, setParams] = useState(emptyObj)
    const handleClusterChange = useCallback(clusterId => setParams({ clusterId }), [])
    const [data, loading, reload] = useDataLoader(deploymentActions.list, params)
    return <div>
      <ClusterPicklist
        onChange={handleClusterChange}
        value={params.clusterId}
      />
      <ListContainer loading={loading} reload={reload} data={data} />
    </div>
  }
}

export const options = {
  loaderFn: deploymentActions.list,
  deleteFn: deploymentActions.delete,
  addUrl: '/ui/kubernetes/deployments/add',
  addText: 'Add Deployment',
  columns: [
    { id: 'name', label: 'Name' },
    { id: 'clusterName', label: 'Cluster' },
    { id: 'created', label: 'Created' },
  ],
  name: 'Deployments',
  title: 'Deployments',
  ListPage,
}
const components = createCRUDComponents(options)
export const DeploymentsList = components.List

export default components.ListPage
