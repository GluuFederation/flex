import React from 'react'
import PropTypes from 'prop-types'
import { CardText } from 'Components'
import { useTranslation } from 'react-i18next'

const CardTextDemo = (props) => {
  const { t } = useTranslation()
  return (
    <CardText>
      <span className="me-2">
        #{ props.cardNo }
      </span> 
      {t("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")} 
      {t("Nulla nisl elit, porta a sapien eget, fringilla sagittis ex.")}
    </CardText>
  )
}
CardTextDemo.propTypes = {
  cardNo: PropTypes.node
}
CardTextDemo.defaultProps = {
  cardNo: "?.??"
}

export { CardTextDemo }
