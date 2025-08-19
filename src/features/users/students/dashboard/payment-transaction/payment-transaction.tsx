import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings } from 'lucide-react'

interface Transaction {
  sn: number
  transactionRef: string
  transactionDate: string
  amount: number
  status: "Successful" | "Approved" | "Pending" | "Failed"
  currency?: string
}

interface PaymentTransactionsProps {
  transactions: Transaction[]
}

export function PaymentTransactions({ transactions }: PaymentTransactionsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Successful":
        return "bg-green-600 hover:bg-green-700"
      case "Approved":
        return "bg-green-600 hover:bg-green-700"
      case "Pending":
        return "bg-red-600 hover:bg-red-700"
      default:
        return "bg-gray-600 hover:bg-gray-700"
    }
  }

  const formatAmount = (amount: number, currency = "₦") => {
    return `${currency}${amount.toLocaleString()}.00`
  }

  return (
    <div className="bg-[#FFFFFF] border-[2px] px-[1rem] py-[31px] border-[#EDF2F5] w-full mt-[14px]">
      <div className="pb-3">
        <div className="flex items-center justify-between text-lg">
          <span>Recent Payment Transactions</span>
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">SN</th>
                <th className="text-left py-2 px-2">Transaction Ref.</th>
                <th className="text-left py-2 px-2">Transaction Date</th>
                <th className="text-left py-2 px-2">Transaction Amount(₦)</th>
                <th className="text-left py-2 px-2">Transaction Code/Response</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.sn} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">{transaction.sn}</td>
                  <td className="py-3 px-2">
                    <div>
                      <p className="font-medium">{transaction.transactionRef}</p>
                      <p className="text-xs text-gray-500">2024/2025</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{transaction.transactionDate}</td>
                  <td className="py-3 px-2 font-medium">{formatAmount(transaction.amount)}</td>
                  <td className="py-3 px-2">
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
          <Button 
            variant="destructive" 
            size="sm"
            className="bg-red-600 hover:bg-red-700"
          >
            View All Transactions
          </Button>
        </div>
      </div>
    </div>
  )
}
