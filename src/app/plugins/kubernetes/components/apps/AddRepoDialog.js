import React, { useCallback, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, Table, TableBody, TableRow, TableCell, Checkbox,
} from '@material-ui/core'
import { clusterActions } from 'k8s/components/infrastructure/actions'
import useDataLoader from 'core/hooks/useDataLoader'
import { except, emptyArr } from 'utils/fp'
import Progress from 'core/components/progress/Progress'
import { repositoryActions } from 'k8s/components/apps/actions'
import useDataUpdater from 'core/hooks/useDataUpdater'
import Wizard from 'core/components/wizard/Wizard'
import WizardStep from 'core/components/wizard/WizardStep'
import TextField from 'core/components/validatedForm/TextField'
import ValidatedForm from 'core/components/validatedForm/ValidatedForm'

// The modal is technically inside the row, so clicking anything inside
// the modal window will cause the table row to be toggled.
const stopPropagation = e => {
  // Except for <a href=""> style links
  if (e.target.tagName.toUpperCase() === 'A') { return }
  e.preventDefault()
  e.stopPropagation()
}

export default ({ onClose }) => {
  const [clusters, loadingClusters] = useDataLoader(clusterActions.list)
  const [create, creating] = useDataUpdater(repositoryActions.create, onClose)
  const [selectedClusters, updateSelectedClusters] = useState(emptyArr)
  const toggleRow = useCallback(uuid => () => {
    updateSelectedClusters(selectedClusters.includes(uuid)
      ? except(uuid, selectedClusters)
      : [...selectedClusters, uuid],
    )
  }, [selectedClusters])
  const handleSubmit = useCallback(
    async data => {
      return create({ ...data, clusters: selectedClusters })
    },
    [selectedClusters])

  const renderClusterRow = ({ uuid, name }) => {
    return (
      <TableRow key={uuid}>
        <TableCell padding="checkbox">
          <Checkbox checked={selectedClusters.includes(uuid)} onClick={toggleRow(uuid)} color="primary" />
        </TableCell>
        <TableCell>{name}</TableCell>
      </TableRow>
    )
  }

  return (
    <Dialog fullWidth open onClose={onClose} onClick={stopPropagation}>
      <DialogTitle>Add New Repository</DialogTitle>
      <DialogContent>
        <Progress loading={loadingClusters || creating} inline renderContentOnMount>
          <Wizard onComplete={handleSubmit} onCancel={onClose} showSteps={false}>
            {({ onNext, setWizardContext }) =>
              <>
                <WizardStep stepId="repoFields" label="Repository fields">
                  <ValidatedForm triggerSubmit={onNext} onSubmit={setWizardContext}>
                    <TextField id="name" label="Name" required />
                    <TextField id="url" label="URL" required info="The URL that points to the helm chart store" />
                    <TextField id="source" label="Source" info="URL that points to the source core" />
                  </ValidatedForm>
                </WizardStep>
                <WizardStep stepId="repoClusters" label="Repository clusters">
                  <Table>
                    <TableBody>
                      {clusters.map(renderClusterRow)}
                    </TableBody>
                  </Table>
                </WizardStep>
              </>
            }
          </Wizard>
        </Progress>
      </DialogContent>
    </Dialog>
  )
}
