import React from 'react'
import ValidatedForm from 'core/components/validatedForm/ValidatedForm'
import PicklistField from 'core/components/validatedForm/PicklistField'
import SubmitButton from 'core/components/SubmitButton'
import createAddComponents from 'core/helpers/createAddComponents'
import ClusterPicklist from 'k8s/components/common/ClusterPicklist'
import TextField from 'core/components/validatedForm/TextField'
import { namespacesDataKey } from './actions'
import useParams from 'core/hooks/useParams'

const defaultParams = {
  masterNodeClusters: true,
}
export const AddNamespaceForm = ({ onComplete }) => {
  const { params, getParamsUpdater } = useParams(defaultParams)
  return (
    <ValidatedForm onSubmit={onComplete}>
      <TextField id="name" label="Name" required />
      <PicklistField
        DropdownComponent={ClusterPicklist}
        id="clusterId"
        label="Cluster"
        onChange={getParamsUpdater('clusterId')}
        value={params.clusterId}
        required
      />
      <SubmitButton>Add Namespace</SubmitButton>
    </ValidatedForm>
  )
}

export const options = {
  dataKey: namespacesDataKey,
  FormComponent: AddNamespaceForm,
  listUrl: '/ui/kubernetes/namespaces',
  name: 'AddNamespace',
  title: 'Add Namespace',
}

const { AddPage } = createAddComponents(options)

export default AddPage
