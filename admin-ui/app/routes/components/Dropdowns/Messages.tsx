import {  
  AvatarAddOn,
  AvatarImage,
  Media
} from 'Components'
import { randomArray, randomAvatar } from './../../../utilities'
import { useTranslation } from 'react-i18next'

const status = [
  "success",
  "danger",
  "warning",
  "secondary"
]

const Messages = () => {
  const { t } = useTranslation()
  return (
   
      <Media>
        <Media left className="me-4">
          <AvatarImage
            size="md"
            src={ randomAvatar() }
            addOns={[
              <AvatarAddOn.Icon 
                className="fa fa-circle"
                color="white"
                key="avatar-icon-bg"
              />,
              <AvatarAddOn.Icon 
                className="fa fa-circle"
                color={ randomArray(status) }
                key="avatar-icon-fg"
              />
            ]}
          />
        </Media>
        <Media body className="text-start">
          <span className="d-flex justify-content-start">
            <span className="h6 pb-0 mb-0 d-flex align-items-center">
              { 'faker.name.firstName()' } { 'faker.name.lastName()' }
            </span>
                      
            <span className="ms-1 small">(23)</span>
            <span className="ms-auto small">{t("Now")}</span>
          </span>
          <p className="mt-2 mb-1">
            { 'faker.name.firstName()' }
          </p>
          <span className="small">
            { 'faker.date.past().toString()' }
          </span>
        </Media>
      </Media>
   

  )
}

export { Messages }
