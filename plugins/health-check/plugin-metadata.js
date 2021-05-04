import HealthCheck from './HealthCheck'
import healthCheckReducer from './redux/reducers/HealthCheckReducers'
import healthCheckSaga from './redux/sagas/HealthCheckSaga'

const pluginMetadata = {
    menus: [
        { name: "Health Check", component: HealthCheck, path: "/health-check" }
    ],
    reducers: [
        { name: "healthCheckReducer", reducer: healthCheckReducer }
    ],
    sagas: [healthCheckSaga()]
}

export default pluginMetadata;