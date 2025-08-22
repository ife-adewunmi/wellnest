import { Card, CardContent, CardHeader, CardTitle } from '@/shared-components/ui/card'
import { Button } from '@/shared-components/ui/button'
import { Badge } from '@/shared-components/ui/badge'
import { Settings } from 'lucide-react'

interface Transaction {
  sn: number
  transactionRef: string
  transactionDate: string
  amount: number
  status: 'Successful' | 'Approved' | 'Pending' | 'Failed'
  currency?: string
}

interface PaymentTransactionsProps {
  transactions: Transaction[]
}

export function PaymentTransactions({ transactions }: PaymentTransactionsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Successful':
        return 'bg-green-600 hover:bg-green-700'
      case 'Approved':
        return 'bg-green-600 hover:bg-green-700'
      case 'Pending':
        return 'bg-red-600 hover:bg-red-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  const formatAmount = (amount: number, currency = '₦') => {
    return `${currency}${amount.toLocaleString()}.00`
  }

  return (
    <div className="mt-[14px] w-full border-[2px] border-[#EDF2F5] bg-[#FFFFFF] px-[1rem] py-[31px]">
      <div className="pb-3">
        <div className="flex items-center justify-between text-lg">
          <span>Recent Payment Transactions</span>
          <Settings className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-2 text-left">SN</th>
                <th className="px-2 py-2 text-left">Transaction Ref.</th>
                <th className="px-2 py-2 text-left">Transaction Date</th>
                <th className="px-2 py-2 text-left">Transaction Amount(₦)</th>
                <th className="px-2 py-2 text-left">Transaction Code/Response</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.sn} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-3">{transaction.sn}</td>
                  <td className="px-2 py-3">
                    <div>
                      <p className="font-medium">{transaction.transactionRef}</p>
                      <p className="text-xs text-gray-500">2024/2025</p>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-gray-600">{transaction.transactionDate}</td>
                  <td className="px-2 py-3 font-medium">{formatAmount(transaction.amount)}</td>
                  <td className="px-2 py-3">
                    <Badge className={`text-white ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
            View All Transactions
          </Button>
        </div>
      </div>
    </div>
  )
}
