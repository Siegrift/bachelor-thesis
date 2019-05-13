import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { UploadsState } from '../../types/common'
import { format } from 'date-fns'
import skLocale from 'date-fns/locale/sk'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const styles = (theme: Theme) => ({
  list: {
    maxHeight: 300,
    overflow: 'auto',
    borderRadius: theme.spacing.unit,
    background: theme.colors.background.lightGray,
  },
  secondaryText: {
    textAlign: 'left' as any,
  },
})

interface Props extends WithStyles<typeof styles> {
  closeDialog: () => void
  getUpload: (uploadId: string) => void
  refetchUploads: () => void
  uploadsState: UploadsState
}

class LoadDialog extends React.Component<Props> {
  state = { selectedUploadId: undefined, hideAutosaved: true }

  onLoadFiles = () => {
    const { closeDialog, getUpload } = this.props
    const { selectedUploadId } = this.state

    if (selectedUploadId) getUpload(selectedUploadId)
    closeDialog()
  }

  onListItemClick = (clickedItem: string) => () => {
    this.setState({ selectedUploadId: clickedItem })
  }

  toggleHideAutosaved = () => {
    this.setState({ hideAutosaved: !this.state.hideAutosaved })
  }

  loadOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.onLoadFiles()
    }
  }

  getShowableUploads = () => {
    const { uploadsState } = this.props
    const { hideAutosaved } = this.state

    return uploadsState.uploads
      .filter((upload) => (hideAutosaved ? !upload.isAutosave : true))
      .sort((e1, e2) => {
        // latest entries first
        return Date.parse(e2.createdAt) - Date.parse(e1.createdAt)
      })
  }

  componentDidMount() {
    const { uploadsState, refetchUploads } = this.props

    if (uploadsState.uploads.length > 0) {
      this.setState({ selectedUploadId: this.getShowableUploads()[0].id })
    }
    refetchUploads()
  }

  render() {
    const { closeDialog, classes } = this.props
    const { selectedUploadId, hideAutosaved } = this.state

    return [
      <DialogTitle key="title" id="form-dialog-title">
        Načítať
      </DialogTitle>,
      <DialogContent key="content">
        <DialogContentText>Vyberte, ktoré súbory načítať</DialogContentText>
        <List dense={false} className={classes.list}>
          {this.getShowableUploads().map(({ id, name, createdAt }) => {
            return (
              <ListItem
                key={id}
                button={true}
                onClick={this.onListItemClick(id)}
                selected={selectedUploadId === id}
                onKeyDown={this.onLoadFiles}
              >
                <ListItemText
                  primary={name}
                  secondary={format(
                    Date.parse(createdAt),
                    'DD-MM-YYYY HH:mm:ss',
                    {
                      locale: skLocale,
                    },
                  )}
                  classes={{ secondary: classes.secondaryText }}
                />
              </ListItem>
            )
          })}
        </List>
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={hideAutosaved}
              onChange={this.toggleHideAutosaved}
            />
          }
          label="Skryť automaticky uložené"
          onKeyDown={this.loadOnEnter}
        />
      </DialogContent>,
      <DialogActions key="actions">
        <Button onClick={closeDialog} color="primary" variant="contained">
          Zrušiť
        </Button>
        <Button
          onClick={this.onLoadFiles}
          color="primary"
          variant="contained"
          disabled={!selectedUploadId}
        >
          Načítať
        </Button>
      </DialogActions>,
    ]
  }
}

export default withStyles(styles)(LoadDialog)
