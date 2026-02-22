import * as dotenv from 'dotenv'
import XHR2 from 'xhr2'

global.XMLHttpRequest = XHR2
dotenv.config({ path: '.env.test' })
