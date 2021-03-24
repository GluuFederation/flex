import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
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
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  function getBadgeTheme(status) {
    if (status === 'ACTIVE') {
      return 'primary'
    } else {
      return 'warning'
    }
  }
  function handleGoToCustomScriptAddPage() {
    return history.push('/script/new')
  }
  function handleGoToCustomScriptEditPage(row) {
    dispatch(setCurrentItem(row))
    return history.push(`/script/edit:` + row.inum)
  }
  function handleCustomScriptDelete(row) {
    dispatch(deleteCustomScript(row.inum))
    setItem(row)
    toggle()
  }
  function onDeletionConfirmed() {
    // perform delete request
    toggle()
  }
  return (
    <React.Fragment>
      <Container>
        <ScrollableTabsButtonAuto scripts={scripts} loading={loading} />
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
