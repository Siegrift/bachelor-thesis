import React from 'react'
import Paper from '@material-ui/core/Paper'
import { createStyles, withStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import classNames from 'classnames'

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      backgroundColor: theme.colors.background.editor,
      borderRadius: 10,
      border: `solid 3px ${theme.palette.common.black}`,
      padding: theme.spacing.unit * 2,
      maxWidth: '80vh',
    },
  })

const DarkPaper = ({ children, classes, className, ...other }: any) => {
  return (
    <Paper
      className={classNames(classes.paper, className)}
      elevation={10}
      {...other}
    >
      {children}
    </Paper>
  )
}

export default withStyles(styles)(DarkPaper)
