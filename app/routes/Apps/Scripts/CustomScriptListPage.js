import React, { useState, useEffect } from 'react'
import MaterialTable from 'material-table'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge } from 'reactstrap'
import GluuDialog from '../Gluu/GluuDialog'
import CustomScriptDetailPage from '../Scripts/CustomScriptDetailPage'
import { Container } from './../../../components'
import ScrollableTabsButtonAuto from './CustomScriptListTab'
import {
  getCustomScripts,
  setCurrentItem,
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
    dispatch(setCurrentItem(row))
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
