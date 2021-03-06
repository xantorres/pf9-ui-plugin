import React from 'react'
import createCRUDComponents from 'core/helpers/createCRUDComponents'
import ClusterPicklist from 'k8s/components/common/ClusterPicklist'
import useDataLoader from 'core/hooks/useDataLoader'
import namespaceActions from './actions'
import { createUsePrefParamsHook } from 'core/hooks/useParams'
import { listTablePrefs } from 'app/constants'
import { pick } from 'ramda'

const defaultParams = {
  masterNodeClusters: true,
}
const usePrefParams = createUsePrefParamsHook('Namespaces', listTablePrefs)

const ListPage = ({ ListContainer }) => {
  return () => {
    const { params, getParamsUpdater } = usePrefParams(defaultParams)
    const [namespaces, loading, reload] = useDataLoader(namespaceActions.list, params)
    return <ListContainer
      loading={loading}
      reload={reload}
      data={namespaces}
      getParamsUpdater={getParamsUpdater}
      filters={
        <ClusterPicklist
          onChange={getParamsUpdater('clusterId')}
          value={params.clusterId}
          onlyMasterNodeClusters
        />
      }
      {...pick(listTablePrefs, params)}
    />
  }
}

export const options = {
  addUrl: '/ui/kubernetes/namespaces/add',
  addText: 'Add Namespace',
  columns: [
    { id: 'name', label: 'Name' },
    { id: 'clusterName', label: 'Cluster' },
    { id: 'created', label: 'Created' },
  ],
  loaderFn: namespaceActions.list,
  deleteFn: namespaceActions.delete,
  editUrl: '/ui/kubernetes/namespaces/edit',
  name: 'Namespaces',
  title: 'Namespaces',
  ListPage,
}

const components = createCRUDComponents(options)
export const NodesList = components.List

export default components.ListPage
