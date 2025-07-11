import { Media, Button } from 'reactstrap'

const Attachment = ({ mediaClassName, icon, iconClassName, BgIcon, BgIconClassName }: any) => {
  return (
    <Media className={`${mediaClassName}`}>
      <Media left className="me-2">
        <span className="fa-stack fa-lg">
          <i className={`fa fa-square fa-stack-2x fa-${BgIcon} fa-stack-1x ${BgIconClassName}`}></i>
          <i className={`fa fa-${icon} fa-stack-1x ${iconClassName}`}></i>
        </span>
      </Media>
      <Media body className="d-flex flex-column flex-md-row">
        <div>
          <div className="text-inverse text-truncate">{'faker.system.fileName()'}</div>
          <span>
            by{' '}
            <span>
              {'faker.name.firstName()'} {'faker.name.firstName()'}
            </span>
            <span className="text-muted"> · </span>
            <span>{'faker.finance.amount()'} Kb</span>
          </span>
        </div>
        <div className="ms-md-auto flex-row-reverse flex-md-row d-flex justify-content-end mt-2 mt-md-0">
          <div className="text-start text-md-right me-3">
            04-Oct-2012
            <br />
            05:20 PM
          </div>
          <Button color="link" className="align-self-center me-2 me-md-0">
            <i className="fa fa-fw fa-download"></i>
          </Button>
        </div>
      </Media>
    </Media>
  )
}
Attachment.defaultProps = {
  mediaClassName: '',
  icon: 'question',
  iconClassName: 'text-white',
  BgIcon: 'square',
  BgIconClassName: 'text-muted',
}

export { Attachment }
