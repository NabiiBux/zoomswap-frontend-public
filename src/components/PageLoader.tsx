import React from 'react'
import styled from 'styled-components'
import { Spinner } from '@zoomswap-libs/uikit'
import Page from './layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ZoomSpinner = styled(Spinner)``

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Spinner />
    </Wrapper>
  )
}

export default PageLoader
