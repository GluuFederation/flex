import React, { useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { uuid } from 'uuidv4'
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
    { name: 'begin', display: "BEGIN" },
    { 
      display: "VAR", 
      type: ['boolean', 'number', 'string', 'map', 'list'],
      name: '',
      value: null,
    },
    { name: 'if-else', display: "IF-ELSE", condition: '', if: '', else: '' },
    { name:'end', display: "END" },
  ])
  const [boardBlock, setBoardBlock] = useState([])
  const classes = styles()

  const handleEnd = (event) => {
    const { item: { innerText } } = event || null
    if (innerText) {
      const currentItem = boardBlock[boardBlock.length - 1]
      currentItem.id = uuid()

      console.log('currentItem', currentItem)

    }
  }

  SetTitle(t('menus.blockFlow'))

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <GluuViewWrapper canShow>
          <div className={classes.root}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
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
                    {baseBlock.map((item, key) => (
                      <div key={`base-${key}`} className={classes.block}>{item.display}</div>
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
                    className={classes.boardBlock}
                  >
                    {boardBlock.map((item, key) => (
                      <div key={`board-${item.id}-${key}`} className={classes.block}>
                        {item.display}
                      </div>
                    ))}
                  </ReactSortable>
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
