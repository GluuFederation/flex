// @ts-nocheck
import React from 'react'
import { v4 as uuid } from 'uuid'
import { chain, random, mapValues } from 'lodash'

import {
  Container,
  FloatGrid as Grid,
  Button,
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from 'Components'
import { applyColumn } from 'Components/FloatGrid'
import { HeaderMain } from 'Routes/components/HeaderMain'

export class DragAndDropLayout extends React.Component {
  constructor(props) {
    super(props)

    this._lastLayout = this._generateLayout()

    this.state = {
      layouts: this._lastLayout,
      compactType: 'vertical',
      fluid: false,
      texts: this._generateTexts(this._lastLayout),
    }

    this.generateLayoutHandler = this.generateLayoutHandler.bind(this)
    this.resetLayoutHandler = this.resetLayoutHandler.bind(this)
  }

  generateLayoutHandler() {
    this._lastLayout = this._generateLayout()

    this.setState({
      layouts: this._lastLayout,
      texts: this._generateTexts(this._lastLayout),
    })
  }

  resetLayoutHandler() {
    this.setState({
      layouts: this._lastLayout,
    })
  }

  selectCompactType(compactType) {
    this.setState({ compactType })
  }

  selectFluid(fluid) {
    this.setState({ fluid })
  }

  render() {
    const { compactType, fluid, texts } = this.state

    return (
      <React.Fragment>
        <Container fluid={fluid}>
          <HeaderMain title="Drag &amp; Drop Layout" className="mb-5 mt-4" />
          <p>
            <strong>React-Grid Layout</strong> is a grid layout system much like Packery or Gridster
            for React. Unlike those systems, it is responsive and supports breakpoints. These
            breakpoints can be provided in the same way as in Reactstrap&apos;s Grid system.
          </p>
          <div className="d-flex align-items-center pb-4">
            <Button color="primary" onClick={this.generateLayoutHandler}>
              Generate New Layout
            </Button>

            <UncontrolledDropdown className="ms-2">
              <DropdownToggle outline>
                Change Compaction Type:&nbsp;
                <strong>
                  {!compactType && 'No Compactions'}
                  {compactType === 'vertical' && 'Vertical'}
                  {compactType === 'horizontal' && 'Horizontal'}
                </strong>
                <i className="fa fa-angle-down ms-2" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem active={!compactType} onClick={() => this.selectCompactType(null)}>
                  No Compactions
                </DropdownItem>
                <DropdownItem
                  active={compactType === 'vertical'}
                  onClick={() => this.selectCompactType('vertical')}
                >
                  Vertical
                </DropdownItem>
                <DropdownItem
                  active={compactType === 'horizontal'}
                  onClick={() => this.selectCompactType('horizontal')}
                >
                  Horizontal
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown className="ms-2">
              <DropdownToggle outline>
                Layout:&nbsp;
                <strong>
                  {!fluid && 'Container'}
                  {fluid && 'Fluid'}
                </strong>
                <i className="fa fa-angle-down ms-2" />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem active={!fluid} onClick={() => this.selectFluid(false)}>
                  Container
                </DropdownItem>
                <DropdownItem active={fluid} onClick={() => this.selectFluid(true)}>
                  Fluid
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <Button color="link" className="ms-2" onClick={this.resetLayoutHandler}>
              <i className="fa fa-times-circle text-danger fa-fw me-1" />
              Reset
            </Button>
          </div>
        </Container>
        <Grid className="mt-4" fluid={this.state.fluid} compactType={compactType}>
          <Grid.Row
            onLayoutChange={(layouts) => this.setState({ layouts })}
            columnSizes={this.state.layouts}
            rowHeight={55}
          >
            {chain(this.state.layouts)
              .keys()
              .map((layoutKey) => (
                <Grid.Col {...applyColumn(layoutKey, this.state.layouts)} key={layoutKey}>
                  <Card>
                    <CardHeader className="bb-0 pt-3 pb-0 bg-none" tag="h6">
                      <i className="fa fa-ellipsis-v me-2"></i> {texts[layoutKey].title}
                    </CardHeader>
                    <CardBody style={{ overflow: 'hidden' }} className="pt-3">
                      {texts[layoutKey].desc}
                    </CardBody>
                  </Card>
                </Grid.Col>
              ))
              .value()}
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }

  _generateLayout = (rowsCount = 3) => {
    const TOTAL_ROWS = 12
    const HEIGHT = 5
    let output = {}

    for (let i = 0; i < rowsCount; i++) {
      let availableRow = TOTAL_ROWS
      while (availableRow > 0) {
        const newCol = availableRow < TOTAL_ROWS ? availableRow : random(3, 9)

        availableRow -= newCol
        output = {
          ...output,
          [uuid()]: { md: newCol, h: HEIGHT },
        }
      }
    }

    return output
  }

  _generateTexts = (layouts) =>
    mapValues(layouts, () => ({
      title: 'faker.commerce.productName()',
      desc: 'faker.lorem.paragraph()',
    }))
}
