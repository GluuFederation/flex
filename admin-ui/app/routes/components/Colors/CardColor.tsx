import { Card, CardTitle, CardBody, CardHeader } from 'Components'

import { InfoPopover } from './InfoPopover'
import { useTranslation } from 'react-i18next'

interface CardColorProps {
  cardClass?: string
  color: string
  hex: string
  rgba: string
  cmyk: string
  scss?: string
}

const CardColor: React.FC<CardColorProps> = (props) => {
  const { t } = useTranslation()
  return (
    <Card type="border" color={props.color} className={`mb-3 ${props.cardClass}`}>
      <CardHeader className={`bg-${props.color}`} style={{ height: '120px' }} />
      <CardBody>
        <CardTitle tag="h6">{props.color}</CardTitle>
        <dl className="row mb-0">
          <dt className="col-sm-4">Hex</dt>
          <dd className="col-sm-8 text-inverse samp">{props.hex}</dd>
          <dt className="col-sm-4">Rgba</dt>
          <dd className="col-sm-8 text-inverse">{props.rgba}</dd>
          <dt className="col-sm-4">Cmyk</dt>
          <dd className="col-sm-8 text-inverse">{props.cmyk}</dd>
          <dt className="col-sm-4">Scss</dt>
          <dd className="col-sm-8 text-inverse">${props.color}</dd>
          <dt className="col-sm-4">More</dt>
          <dd className="col-sm-8 text-inverse">
            <InfoPopover colorId={props.color} href="#" className="" tag="">
              {t('Details')}
              <i className="fa fa-angle-up ms-1"></i>
            </InfoPopover>
          </dd>
        </dl>
      </CardBody>
    </Card>
  )
}

export { CardColor }
