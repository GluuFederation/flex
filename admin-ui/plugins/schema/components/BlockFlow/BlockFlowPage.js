import React, { useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
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
  const [baseBlock, setBaseBlock] = useState([
    { id: 1, name: "BEGIN" },
    { id: 2, name: "VAR" },
    { id: 3, name: "IF-ELSE" },
    { id: 4, name: "END" },
  ])
  const [boardBlock, setBoardBlock] = useState([])
  const classes = styles()

  const handleEnd = (a, b) => {
    console.log('boardBlock', boardBlock, a, b)
  }

  SetTitle(t('menus.blockFlow'))

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Paper className={classes.paper}>
                  <h5 className={classes.blockContainerTitle}>Base block</h5>
                  <ReactSortable 
                    list={baseBlock} 
                    setList={setBaseBlock}
                    clone={item => ({ ...item })}
                    onEnd={handleEnd}
                    group={{ name: "shared", pull: "clone", put: false }}
                    animation={200}
                    sort= {false}
                    delay={1}
                  >
                    {baseBlock.map((item) => (
                      <div key={item.id} className={classes.block}>{item.name}</div>
                    ))}
                  </ReactSortable>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <ReactSortable 
                    list={boardBlock} 
                    setList={setBoardBlock}
                    group={{ name: "shared" }}
                    animation={200}
                    delay={1}
                    clone={item => ({ ...item })}
                  >
                    {boardBlock.map((item, key) => (
                      <div key={`${item.id}-${key}`} className={classes.block}>
                        {item.name}
                      </div>
                    ))}
                  </ReactSortable>
                </Paper>
              </Grid>
              <Grid item xs={3}>
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
