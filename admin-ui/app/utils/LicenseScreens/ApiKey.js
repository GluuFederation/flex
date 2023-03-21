import React, { useEffect, useState } from 'react'
import { checkUserApi, checkUserLicenceKey } from 'Redux/actions'
import logo from 'Images/logos/logo192.png'
import { useDispatch, useSelector } from 'react-redux'
import './style.css'

function ApiKey() {
  const dispatch = useDispatch()
  const serverError = useSelector((state) => state.licenseReducer.error)
  const isLoading = useSelector((state) => state.licenseReducer.isLoading)

  const [submitted, setIsSubmitted] = useState(false)
  const [licenseKey, setLicenseKey] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const submitLicenseKey = () => {
    setIsSubmitted(true)
    if (licenseKey != '') {
      dispatch(
        checkUserLicenceKey({
          licenseKey: licenseKey,
        }),
      )
    }
    console.log('Submit License Key')
  }

  return (
    <div>
      {isLoading && (
        <div className="loader-outer">
          <div className="loader"></div>
        </div>
      )}
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
          <div className="col-md-8 text-center text-danger mx-auto mb-3">
            {serverError}
          </div>
        </div>

          <div className="row">
            <div className="col-md-8 mx-auto">
              <label>License Key*</label>
              <input
                type="text"
                className={
                  submitted && licenseKey == ''
                    ? 'border-danger form-control'
                    : 'form-control'
                }
                value={licenseKey}
                name="apiKey"
                onChange={(e) => setLicenseKey(e.target.value)}
              />
              <div className="text-danger">
                {submitted && licenseKey == '' && 'This field is required'}
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => submitLicenseKey()}
                className="btn mt-3"
                style={{ backgroundColor: '#00a361', color: 'white' }}
              >
                {isLoading ? 'Submitting please wait...' : 'Submit'}
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}
export default ApiKey
