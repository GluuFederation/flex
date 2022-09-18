import React, { useState } from 'react'
import ReactBpmn from 'react-bpmn'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { connect } from 'react-redux'
import { Card, CardBody } from 'Components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'

function BlockFlowPage({ permissions }) {
  const { t } = useTranslation()
  const classes = styles()

  const onShown = () => {
    console.log('diagram shown')
  }

  const onLoading = () => {
    console.log('diagram loading')
  }

  const onError = (e) => {
    console.log('failed to show diagram')
  }

  SetTitle(t('menus.blockFlow'))

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow>
          <div className={classes.root}>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Paper className={classes.paper}>
                  <ReactBpmn
                    url="/public/diagram.bpmn"
                    onShown={ onShown }
                    onLoading={ onLoading }
                    onError={ onError }
                  />
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <h5 className={classes.blockContainerTitle}>DSL Code</h5>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </GluuViewWrapper>
      </CardBody>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    permissions: state.authReducer.permissions,
  }
}
export default connect(mapStateToProps)(BlockFlowPage)
