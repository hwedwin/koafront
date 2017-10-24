import React, { Component } from 'react'

class Bundle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mod: null
    }
  }

  async componentDidMount() {
    this.props.load((mod) => {
      this.setState({
        mod: mod.default || mod
      })
    })
  }

  render() {
    return (
      this.state.mod ? this.props.children(this.state.mod) : null
    )
  }
}

export default Bundle;