import createCRUDComponents from 'core/helpers/createCRUDComponents'
import { mngmUsersDataKey } from 'k8s/components/userManagement/actions'

export const options = {
  columns: [
    { id: 'id', label: 'OpenStack ID', display: false },
    { id: 'username', label: 'Username' },
    { id: 'displayname', label: 'Display Name' },
    { id: 'two_factor', label: 'Two-Factor Authentication' },
    { id: 'tenants', label: 'Tenants' },
  ],
  dataKey: mngmUsersDataKey,
  // editUrl: '/ui/kubernetes/infrastructure/users/edit',
  name: 'Users',
  title: 'Users',
  uniqueIdentifier: 'id',
}

const { ListPage: UsersListPage } = createCRUDComponents(options)

export default UsersListPage
