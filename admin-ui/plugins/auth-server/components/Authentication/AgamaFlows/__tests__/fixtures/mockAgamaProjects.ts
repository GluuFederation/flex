import type { Deployment } from 'JansConfigApi'
import type { AgamaProject } from '../../types'

export const mockDeployments: Deployment[] = [
  {
    dn: 'agama-project-1-dn',
    id: 'test-project-1',
    createdAt: '2024-01-15T10:30:00.000Z',
    finishedAt: '2024-01-15T10:31:00.000Z',
    details: {
      projectMetadata: {
        projectName: 'test-agama-project',
        author: 'Test Author',
        version: '1.0.0',
        description: 'A test Agama project',
        type: 'community',
      },
      flowsError: {},
    },
  },
  {
    dn: 'agama-project-2-dn',
    id: 'test-project-2',
    createdAt: '2024-02-10T08:00:00.000Z',
    details: {
      projectMetadata: {
        projectName: 'pending-agama-project',
        author: 'Another Author',
        version: '2.0.0',
        description: 'A pending Agama project',
        type: 'agama',
      },
      flowsError: {},
    },
  },
]

export const mockAgamaProjects: AgamaProject[] = [
  {
    ...mockDeployments[0],
    deployed_on: '01/15/24, 10:30 AM',
    type: 'community',
    status: 'Processed',
    error: 'No',
  } as AgamaProject,
  {
    ...mockDeployments[1],
    deployed_on: '-',
    type: 'agama',
    status: 'Pending',
    error: '',
  } as AgamaProject,
]

export default mockAgamaProjects
