import HealthCheck from './HealthCheck'
import healthCheckReducer from './redux/reducers/HealthCheckReducers'
import healthCheckSaga from './redux/sagas/HealthCheckSaga'

const pluginMetadata = {
    menus: [
        { icon: 'fa-thermometer-half', label: 'Health Check', component: HealthCheck, path: '/health-check' },
    ],
    routes: [
        { component: HealthCheck, path: '/health-check' },
    ],
    reducers: [
        { name: 'healthCheckReducer', reducer: healthCheckReducer }
    ],
    sagas: [healthCheckSaga()]
}

export default pluginMetadata;