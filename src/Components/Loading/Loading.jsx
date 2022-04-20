import React from 'react';
import ReactLoading from 'react-loading';

//styles
import { Container } from '../styles'

const Loading = () => (
  <Container>
	  <ReactLoading type="bars" color="darkcyan" height={67} width={100} />
  </Container>
);

export default Loading;