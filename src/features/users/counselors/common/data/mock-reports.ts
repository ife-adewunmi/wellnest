import { Reports } from '@/users/counselors/types'

export const MOCK_REPORTS: Reports[] = [
  {
    id: 'uuid-report-1',
    studentId: 'student1',
    name: 'Alice Johnson',
    department: 'Overall positive mood with occasional stress spikes.',
    level: '',
  },
  {
    id: 'uuid-report-2',
    studentId: 'student2',
    name: 'Bob Smith',
    department: 'Consistent low mood, recommend follow-up.',
    level: '',
  },
  {
    id: 'uuid-report-3',
    studentId: 'student3',
    name: 'Charlie Brown',
    department: 'High engagement in activities, stable mood.',
    level: '',
  },
]
