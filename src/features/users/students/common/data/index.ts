export const studentData = {
  name: 'SODIPO, Emmanuel Boluwatife',
  studentId: 'CSC/20/091',
  department: 'BSc Computer Science',
  currentSession: '2024/2025',
  currentSemester: 'Second',
  level: '400',
  avatarUrl: '/placeholder.svg?height=64&width=64',
}

export const pendingIssues = [
  {
    message: 'You have not completed course registration for the following semester(s)',
    semester: '2024/2025 Second Semester',
  },
]

export const transactions = [
  {
    sn: 1,
    transactionRef: 'OAUST/CSC/20/091/933Y16',
    transactionDate: '15 Nov 2024, 7:32AM',
    amount: 153500,
    status: 'Successful' as const,
  },
  {
    sn: 2,
    transactionRef: 'OAUST/CSC/20/091/B9QWLR',
    transactionDate: '19 Feb, 2024, 1:27PM',
    amount: 5000,
    status: 'Approved' as const,
  },
  {
    sn: 3,
    transactionRef: 'OAUST/CSC/20/091/PLJG1',
    transactionDate: '26 Dec, 2023, 7:58AM',
    amount: 153500,
    status: 'Approved' as const,
  },
  {
    sn: 4,
    transactionRef: 'OAUST/CSC/20/091/FWX6CZ',
    transactionDate: '11 Feb, 2023, 3:37AM',
    amount: 153500,
    status: 'Approved' as const,
  },
  {
    sn: 5,
    transactionRef: 'OAUST/CSC/20/091/DFJAC5',
    transactionDate: '11 Feb, 2023, 3:14AM',
    amount: 153500,
    status: 'Pending' as const,
  },
]
