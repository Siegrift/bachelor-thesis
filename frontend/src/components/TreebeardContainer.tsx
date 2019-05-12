import React from 'react'
import FileCopy from '@material-ui/icons/FileCopy'
import ToggleExpanded from '@material-ui/icons/ArrowDropDown'
import ToggleCollapsed from '@material-ui/icons/ArrowRight'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { withStyles, WithStyles } from '@material-ui/core'

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
  },
  file: {
    width: 12,
    height: 12,
    margin: 6,
    color: theme.palette.common.white,
  },
  toggle: {
    width: 24,
    height: 24,
    color: theme.palette.common.white,
  },
})

interface Props extends WithStyles<typeof styles> {
  style: any
  decorators: any
  onClick: any
  node: any
  terminal: any
}
class TreebeardContainer extends React.Component<Props> {
  clickableRef = React.createRef() as any

  componentDidMount() {
    this.clickableRef.current.addEventListener('mouseover', (x: any) => {
      x.currentTarget.classList.toggle('treabeard-hovered')
    })
    this.clickableRef.current.addEventListener('mouseout', (x: any) => {
      x.currentTarget.classList.toggle('treabeard-hovered')
    })
  }

  render() {
    const { style, decorators, terminal, onClick, node } = this.props

    return (
      <div onClick={onClick} ref={this.clickableRef}>
        {!terminal ? this.renderToggle() : this.renderTerminal()}

        <decorators.Header node={node} style={style.header} />
      </div>
    )
  }

  renderTerminal = () => {
    const { classes } = this.props

    return <FileCopy className={classes.file} />
  }

  renderToggle = () => {
    const { classes, node } = this.props

    if (node.toggled) {
      return <ToggleExpanded className={classes.toggle} />
    } else return <ToggleCollapsed className={classes.toggle} />
  }
}

export default withStyles(styles)(TreebeardContainer)
