import React from 'react'
import PropTypes from 'prop-types'
import AddIcon from '@material-ui/icons/Add'
import ListTableColumnButton from 'core/components/listTable/ListTableColumnSelector'
import ListTableFilters from 'core/components/listTable/ListTableFilters'
import ListTableRowActions from './ListTableRowActions'
import PerPageControl from './PerPageControl'
import SearchBar from 'core/components/SearchBar'
import clsx from 'clsx'
import { compose } from 'ramda'
import { Button, Toolbar, Tooltip } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import ListTableFiltersButton from 'core/components/listTable/ListTableFiltersButton'
import FontAwesomeIcon from 'core/components/FontAwesomeIcon'
import moize from 'moize'

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing(1),
    color: theme.palette.grey[600],

  },
  highlight: {},
  spacer: {
    flex: '0 0 auto',
  },
  actions: {
    flex: '1 1 100%',
  },
  button: {
    cursor: 'pointer',
    fontWeight: 300,
    margin: theme.spacing(0, 1),
  },
  toolbar: {
    justifyContent: 'flex-end',
    paddingRight: 0,
  },
  search: {
    margin: theme.spacing(0, 2),
  },
  rowActions: {
    color: 'inherit',
  },
  action: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    cursor: 'pointer',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'center',
    lineHeight: 2,
    fontSize: theme.typography.fontSize * 0.8,
  },
  actionIcon: {
    fontSize: '1.7em',
  },
})

const renderRefreshButton = moize((classes, onRefresh) =>
  onRefresh && <Tooltip title="Refresh list">
    <i className={clsx(classes.button, 'fas fa-fw fa-lg fa-sync')}
      aria-label="Refresh list"
      onClick={onRefresh}
    />
  </Tooltip>)

const ListTableToolbar = ({
  classes, columns, context, filterValues, filters, inlineFilters,
  onAdd, onColumnToggle, onDelete, onEdit, onFilterUpdate,
  onFiltersReset, onSearchChange, onRefresh,
  rowActions, searchTerm, selected, visibleColumns,
  rowsPerPage, onChangeRowsPerPage, rowsPerPageOptions,
}) => {
  const numSelected = (selected || []).length
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <ListTableRowActions actionClassName={classes.action} rowActions={rowActions} selected={selected} />
      {numSelected === 1 && onEdit && (
        <Tooltip title="Edit">
          <div className={classes.action} onClick={onEdit}>
            <FontAwesomeIcon className={classes.actionIcon}>{'pencil-alt'}</FontAwesomeIcon>
            Edit
          </div>
        </Tooltip>
      )}
      {numSelected > 0 && onDelete && (
        <Tooltip title="Delete">
          <div className={classes.action} onClick={onDelete}>
            <FontAwesomeIcon className={classes.actionIcon}>{'trash-alt'}</FontAwesomeIcon>
            Delete
          </div>
        </Tooltip>
      )}
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Toolbar className={classes.toolbar}>
          {onSearchChange && (
            <SearchBar className={classes.search} onSearchChange={onSearchChange} searchTerm={searchTerm} />
          )}
          {filters && inlineFilters && <ListTableFilters
            inline
            columns={columns}
            filters={filters}
            filterValues={filterValues}
            onFilterUpdate={onFilterUpdate}
            onFiltersReset={onFiltersReset}
          />}
          {columns && onColumnToggle && (
            <ListTableColumnButton
              columns={columns}
              visibleColumns={visibleColumns}
              onColumnToggle={onColumnToggle}
            />
          )}
          {renderRefreshButton(classes, onRefresh)}
          {filters && !inlineFilters && <ListTableFiltersButton
            columns={columns}
            filters={filters}
            filterValues={filterValues}
            onFilterUpdate={onFilterUpdate}
            onFiltersReset={onFiltersReset}
          />}
          {onAdd && (
            <Tooltip title="Add">
              <Button color="primary" onClick={onAdd}>
                <AddIcon /> Add
              </Button>
            </Tooltip>
          )}
          <PerPageControl
            value={rowsPerPage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        </Toolbar>
      </div>
    </Toolbar>
  )
}

ListTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    render: PropTypes.func,
    sortWith: PropTypes.func,
    display: PropTypes.bool,
    excluded: PropTypes.bool,
  })).isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({
    columnId: PropTypes.string.isRequired,
    label: PropTypes.string, // Will override column label
    type: PropTypes.oneOf(['select', 'multiselect', 'checkbox', 'custom']).isRequired,
    render: PropTypes.func, // Use for rendering a custom component, received props: {value, onChange}
    filterWith: PropTypes.func, // Custom filtering function, received params: (filterValue, value, row)
    items: PropTypes.array, // Array of possible values (only when using select/multiselect)
  })),
  inlineFilters: PropTypes.bool,
  filterValues: PropTypes.object,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  onFilterUpdate: PropTypes.func,
  onFiltersReset: PropTypes.func,
  onRefresh: PropTypes.func,
  selected: PropTypes.array,
  visibleColumns: PropTypes.array,
  onColumnToggle: PropTypes.func,
  rowsPerPage: PropTypes.number.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
}

export default compose(
  withStyles(toolbarStyles),
)(ListTableToolbar)
