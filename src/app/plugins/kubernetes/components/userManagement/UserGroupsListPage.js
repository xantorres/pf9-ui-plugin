import createCRUDComponents from 'core/helpers/createCRUDComponents'
import { mngmGroupsDataKey } from 'k8s/components/userManagement/actions'

export const options = {
  columns: [
    { id: 'id', label: 'OpenStack ID', display: false },
    { id: 'name', label: 'Group Name' },
    { id: 'description', label: 'Description' },
    { id: 'samlAttributesString', label: 'SAML Attributes Mapped' },
  ],
  dataKey: mngmGroupsDataKey,
  // editUrl: '/ui/kubernetes/infrastructure/groups/edit',
  name: 'Groups',
  title: 'Groups',
  uniqueIdentifier: 'id',
}

const { ListPage: UserGroupsListPage } = createCRUDComponents(options)

export default UserGroupsListPage
