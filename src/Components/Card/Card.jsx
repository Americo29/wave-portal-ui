import React, { Component } from "react";

import { Wrapper } from '../styles'

class Card extends Component{
  render() {
    return (
      <Wrapper>
       {this.props.children}
      </Wrapper>
    )
  }
}

export default Card;