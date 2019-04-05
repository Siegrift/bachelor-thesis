import React from 'react'
import FileCopy from '@material-ui/icons/FileCopy'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { withStyles, WithStyles } from '@material-ui/core'

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
  },
  file: {
    width: 14,
    height: 14,
    margin: 5,
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
      <div
        onClick={onClick}
        style={{ ...style.container }}
        ref={this.clickableRef}
      >
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
    const { style, decorators } = this.props

    return <decorators.Toggle style={style.toggle} />
  }
}

export default withStyles(styles)(TreebeardContainer)
