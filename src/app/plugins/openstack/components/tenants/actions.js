import { gql } from 'apollo-boost'

export const GET_TENANTS = gql`
  {
    tenants {
      id
      name
      description
    }
  }
`

export const REMOVE_TENANT = gql`
  mutation RemoveTenant($id: ID!) {
    removeTenant(id: $id)
  }
`

export const ADD_TENANT = gql`
  mutation CreateTenant($input: TenantInput!) {
    createTenant(input: $input) { id name description }
  }
`

export const UPDATE_TENANT = gql`
  mutation UpdateTenant($id: ID!, $input: TenantInput!) {
    updateTenant(id: $id, input: $input) { id name description }
  }
`

export const loadTenants = async ({ setContext, context, reload }) => {
  if (!reload && context.tenants) { return context.tenants }

  const tenants = await context.apiClient.keystone.getProjects()
  setContext({ tenants })
  return tenants
}
