import React, { useState } from 'react'
import logo from './../../images/logos/logo192.png'
function ApiKey() {
  let params = {
    apiKey: '',
    productCode: '',
    sharedKey: '',
    managementKey: '',
  }

  const [values, setValues] = useState(params)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const submitValues = () => {
    console.log(values)
  }

  return (
    <div>
      <div className="container text-dark">
        <div className="row">
          <div className="col-md-12 text-center my-5">
            <img
              src={logo}
              style={{ maxWidth: '200px' }}
              className="img-fluid"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 text-center h2 mx-auto mb-3">
            Please enter details to activate
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 mx-auto">
            <label>Api Keys</label>
            <input
              type="text"
              className="form-control"
              value={values.apiKey}
              name="apiKey"
              onChange={handleChange}
            />
            <label>Product Code</label>
            <input
              type="text"
              className="form-control"
              value={values.productCode}
              name="productCode"
              onChange={handleChange}
            />
            <label>Shared Key</label>
            <input
              type="text"
              className="form-control"
              value={values.sharedKey}
              name="sharedKey"
              onChange={handleChange}
            />
            <label>Management Key</label>
            <input
              type="text"
              className="form-control"
              value={values.managementKey}
              name="managementKey"
              onChange={handleChange}
            />
            <input
              type="button"
              value={'Submit'}
              onClick={() => submitValues()}
              className="btn mt-3"
              style={{ backgroundColor: '#00a361', color: 'white' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ApiKey
