import React from 'react'

const customStyles = {
  display: 'flex',
}

class TreebeardContainer extends React.Component<any> {
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
        style={{ ...style.container, ...customStyles }}
        ref={this.clickableRef}
      >
        {!terminal ? this.renderToggle() : null}

        <decorators.Header node={node} style={style.header} />
      </div>
    )
  }

  renderToggle() {
    const { animations } = this.props

    if (!animations) {
      return this.renderToggleDecorator()
    }

    return (
      <div
      // animation={animations.toggle.animation}
      // duration={animations.toggle.duration}
      // ref={(ref) => (this.velocityRef = ref)}
      >
        {this.renderToggleDecorator()}
      </div>
    )
  }

  renderToggleDecorator() {
    const { style, decorators } = this.props

    return <decorators.Toggle style={style.toggle} />
  }
}

export default TreebeardContainer
