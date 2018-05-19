import React from 'react'
import { withRouter } from 'react-router-dom'
import { Query } from 'react-apollo'
import requiresAuthentication from 'openstack/util/requiresAuthentication'
import gql from 'graphql-tag'

import Loader from 'core/common/Loader'
import DisplayError from 'core/common/DisplayError'
import ConfirmationDialog from 'core/common/ConfirmationDialog'
import FlavorsList from './FlavorsList'

import { removeFlavor } from '../../actions/flavors'

const GET_FLAVORS = gql`
  {
    flavors {
      id
      name
      ram
      vcpus
      disk
    }
  }
`

@requiresAuthentication
@withRouter
// @connect(mapStateToProps)
class FlavorsListContainer extends React.Component {
  state = {
    showConfirmation: false,
    flavorsToDelete: null,
  }

  redirectToAdd = () => {
    this.props.history.push('/ui/openstack/flavors/add')
  }

  handleDelete = selectedIds => {
    this.setState({ showConfirmation: true })
    const selectedFlavors = this.props.flavors.filter(flavor => selectedIds.includes(flavor.id))
    this.setState({ flavorsToDelete: selectedFlavors })
  }

  handleDeleteCancel = () => {
    this.setState({ showConfirmation: false })
  }

  handleDeleteConfirm = () => {
    this.setState({ showConfirmation: false })
    const flavors = this.state.flavorsToDelete || []
    flavors.forEach(flavor => this.props.dispatch(removeFlavor(flavor.id)))
  }

  deleteConfirmText = () => {
    const { flavorsToDelete } = this.state
    if (!flavorsToDelete) {
      return
    }
    const flavorNames = flavorsToDelete.map(x => x.name).join(', ')
    return `This will permanently delete the following flavor(s): ${flavorNames}`
  }

  render () {
    const { flavors } = this.props

    return (
      <div>
        <ConfirmationDialog
          open={this.state.showConfirmation}
          text={this.deleteConfirmText()}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteConfirm}
        />

        <FlavorsList
          flavors={flavors}
          onAdd={this.redirectToAdd}
          onDelete={this.handleDelete}
        />
      </div>
    )
  }
}

const GraphqlCrudContainer = ({ query, actions, children, ...props }) => {
  return (
    <Query query={query}>
      {({ loading, error, data, client }) => {
        if (loading) { return <Loader /> }
        if (error) { return <DisplayError error={error} /> }
        return children({ data, client, actions: {} })
      }}
    </Query>
  )
}

const GraphqlFlavorsList = () => (
  <GraphqlCrudContainer query={GET_FLAVORS}>
    {({ data, actions }) => (
      <FlavorsListContainer flavors={data.flavors} />
    )}
  </GraphqlCrudContainer>
)

export default GraphqlFlavorsList