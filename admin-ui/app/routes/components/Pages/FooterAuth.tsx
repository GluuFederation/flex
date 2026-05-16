import clsx from 'clsx'
import { FooterText } from '../FooterText'

const FooterAuth = ({ className }: { className?: string }) => (
  <p className={clsx(className, 'small')}>
    <FooterText year={new Date().getFullYear()} name="Gluu Admin UI" />
  </p>
)

export { FooterAuth }
