import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
  
  margin: auto;
  padding: 40px;

  width: 450px;
  height: 300px;
  box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1);  

  @media (max-width: 450px) {
    width: 100%;
  }

`

export const Container = styled.div`
  display: flex;
  align-self: center;

`