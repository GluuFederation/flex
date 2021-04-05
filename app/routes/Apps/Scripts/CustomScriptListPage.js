import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import BlockUi from 'react-block-ui'
import { Container } from './../../../components'
import ScrollableTabsButtonAuto from './CustomScriptListTab'
import {
  getCustomScripts,
  setCurrentItem,
  deleteCustomScript,
} from '../../../redux/actions/CustomScriptActions'
//import scripts from './scripts'

function CustomScriptListPage({ scripts, permissions, loading, dispatch }) {
  useEffect(() => {
    dispatch(getCustomScripts())
  }, [])

  const history = useHistory()
  const [item, setItem] = useState({})
  //const [scriptArr, setScriptArr] = useState(scripts)
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  function removeRowAfterDelete(inum) {
    dispatch(deleteCustomScript(inum));

  }
  return (
    <React.Fragment>
      <Container>
        <BlockUi
          tag="div"
          blocking={loading}
          keepInView={true}
          renderChildren={true}
          message={'Performing the request, please wait!'}>
          <ScrollableTabsButtonAuto scripts={scripts} loading={loading} removeRowAfterDelete={removeRowAfterDelete} />
        </BlockUi>
      </Container>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    scripts: state.customScriptReducer.items,
    loading: state.customScriptReducer.loading,
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(CustomScriptListPage)
