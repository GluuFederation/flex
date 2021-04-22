import React, { useState } from 'react'
import { FormGroup, Col, Row, Button, Input } from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'


class GluuNameValueProperty extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			nameValueLabel: this.props.nameValueLabel,
			name: this.props.name,
			formik: this.props.formik || null,
			keyId: this.props.keyId,
			keyName: this.props.keyName,
			keyLabel: this.props.keyLabel || 'Key',
			keyPlaceholder: this.props.keyPlaceholder || 'Enter key',
			valueId: this.props.valueId,
			valueName: this.props.valueName,
			valueLabel: this.props.valueLabel || 'Value',
			valuePlaceholder: this.props.valuePlaceholder || 'Enter value',
			dataArr: this.props.dataArr || [],
		};
	}

	addClick() {
		this.setState(prevState => ({
			dataArr: [...prevState.dataArr, { key: "", value: "" }]
		}))
	}

	createUI() {
		return this.state.dataArr.map((element, index) => (
			<div key={index}>
				<FormGroup row>
					<GluuLabel label={this.state.keyLabel} />
					<Col sm={9}>
						<Input
							placeholder={this.state.keyPlaceholder}
							id={this.state.keyId}
							name={this.state.keyName}
							defaultValue={element.key}
							onChange={this.handleChange.bind(this, index)}
						/>
					</Col>
				
					<GluuLabel label={this.state.valueLabel} />
					<Col sm={9}>
						<Input
							placeholder={this.state.valuePlaceholder}
							id={this.state.valueId}
							name={this.state.valueName}
							defaultValue={element.value}
							onChange={this.handleChange.bind(this, index)}
						/>
					</Col>
					<Col sm={3}>
						<input type='button' value='remove' onClick={this.removeClick.bind(this, index)} />
					</Col>
				</FormGroup>
					
			</div>

		))
	}

	handleInputChange(input, e) {
		console.log("value", input)
	}

	handleChange(i, e) {
		const { name, value } = e.target;
		let dataArr = [...this.state.dataArr];
		dataArr[i] = { ...dataArr[i], [name]: value };
		this.setState({ dataArr });
		this.state.formik.setFieldValue(this.state.name, dataArr);
	}

	removeClick(i) {
		let dataArr = [...this.state.dataArr];
		dataArr.splice(i, 1);
		this.setState({ dataArr });
		this.state.formik.setFieldValue(this.state.name, dataArr);
	}


	render() {
		return (

			<Row>
				<GluuLabel label={this.state.nameValueLabel} size={9} />

				<input type='button' value='Add more' onClick={this.addClick.bind(this)} />

				{this.createUI()}
			</Row>
		);
	}
}

export default GluuNameValueProperty;	