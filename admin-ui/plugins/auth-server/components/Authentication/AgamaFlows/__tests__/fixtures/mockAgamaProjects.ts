import type { Deployment } from 'JansConfigApi'

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
        version: '2.1.0',
        description: 'A pending Agama project',
        type: 'agama',
      },
      flowsError: {},
    },
  },
]
