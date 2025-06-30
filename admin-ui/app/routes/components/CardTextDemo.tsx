import { CardText } from 'Components'
import { useTranslation } from 'react-i18next'

const CardTextDemo = ({ cardNo }: any) => {
  const { t } = useTranslation()
  return (
    <CardText>
      <span className="me-2">#{cardNo}</span>
      {t('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')}
      {t('Nulla nisl elit, porta a sapien eget, fringilla sagittis ex.')}
    </CardText>
  )
}
export { CardTextDemo }
