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
import { UploadState } from '../../types/common'
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
  loadFiles: (selectedEntry: string) => void
  refetchUploads: () => void
  uploads: UploadState
}

class LoadDialog extends React.Component<Props> {
  state = { selectedEntry: undefined, hideAutosaved: true }

  onLoadFiles = () => {
    const { closeDialog, loadFiles } = this.props
    const { selectedEntry } = this.state

    if (selectedEntry) loadFiles(selectedEntry)
    closeDialog()
  }

  onListItemClick = (clickedItem: string) => () => {
    this.setState({ selectedEntry: clickedItem })
  }

  toggleHideAutosaved = () => {
    this.setState({ hideAutosaved: !this.state.hideAutosaved })
  }

  componentDidMount() {
    const { uploads, refetchUploads } = this.props

    if (uploads.entries.length > 0) {
      this.setState({ selectedEntry: uploads.entries[0] })
    }
    refetchUploads()
  }

  render() {
    const { closeDialog, classes, uploads } = this.props
    const { selectedEntry, hideAutosaved } = this.state

    const uploadEntries = uploads.entries
      .map((upload) => {
        const last = upload.lastIndexOf('-')
        const filename = upload.substr(0, last)
        const time = parseInt(upload.substr(last + 1), 10)
        return { filename, time, raw: upload }
      })
      .filter((upload) => (hideAutosaved ? upload.filename !== 'Autosave' : true))
      .sort((e1, e2) => {
        // latest entries first
        return e2.time - e1.time
      })

    return [
      <DialogTitle key="title" id="form-dialog-title">
        Načítať
      </DialogTitle>,
      <DialogContent key="content">
        <DialogContentText>Vyberte, ktoré súbory načítať</DialogContentText>
        <List dense={false} className={classes.list}>
          {uploadEntries.map(({ raw, time, filename }) => {
            return (
              <ListItem
                key={raw}
                button={true}
                onClick={this.onListItemClick(raw)}
                selected={raw === selectedEntry}
              >
                <ListItemText
                  primary={filename}
                  secondary={format(new Date(time), 'MM-DD-YYYY HH:mm:ss', {
                    locale: skLocale,
                  })}
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
          disabled={!selectedEntry}
        >
          Načítať
        </Button>
      </DialogActions>,
    ]
  }
}

export default withStyles(styles)(LoadDialog)
