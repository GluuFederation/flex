const CardFooterInfo = ({ icon, iconClassName, text }: any) => (
  <div className="small">
    <i className={`fa fa-fw fa-${icon} ${iconClassName} me-2`}></i>
    {text}
  </div>
)
export { CardFooterInfo }
