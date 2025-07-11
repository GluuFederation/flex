import { Media, AvatarAddOn, UncontrolledTooltip, AvatarImage } from 'Components'
import { randomArray, randomAvatar } from './../../utilities'
import { useTranslation } from 'react-i18next'

const status = ['success', 'danger', 'warning', 'secondary']

const Comment = ({ mediaClassName }: any) => {
  const { t } = useTranslation()
  return (
    <Media className={`mb-4 ${mediaClassName}`}>
      <Media left className="me-3">
        <AvatarImage
          size="md"
          src={randomAvatar()}
          className="me-2"
          addOns={[
            <AvatarAddOn.Icon className="fa fa-circle" color="white" key="avatar-icon-bg" />,
            <AvatarAddOn.Icon
              className="fa fa-circle"
              color={randomArray(status)}
              key="avatar-icon-fg"
            />,
          ]}
        />
      </Media>
      <Media body>
        <div className="mb-2">
          <span className="text-inverse me-2">
            {'faker.name.firstName()'} {'faker.name.firstName()'}
          </span>
          <span className="small">13-Jun-2015, 08:13</span>
        </div>
        <p className="mb-1">{'faker.lorem.paragraph()'}</p>
        <div>
          <span className="text-success me-2">+92</span>
          <a href="#" id="tooltipVoteUp1" className="me-2">
            <i className="fa fa-angle-up text-success"></i>
          </a>
          <UncontrolledTooltip placement="top" target="tooltipVoteUp1">
            {t('Vote Up')}
          </UncontrolledTooltip>
          <a href="#" id="tooltipVoteDown2" className="me-2">
            <i className="fa fa-angle-down text-danger"></i>
          </a>
          <UncontrolledTooltip placement="bottom" target="tooltipVoteDown2">
            {t('Vote Down')}
          </UncontrolledTooltip>
          <span className="me-2">·</span>
          <a href="#" className="me-2">
            {t('Reply')}
          </a>
          <span className="me-2">·</span>
          <a href="#">{t('Edit')}</a>
        </div>
      </Media>
    </Media>
  )
}

export { Comment }
