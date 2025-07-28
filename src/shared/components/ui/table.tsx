import React from 'react'

interface TableProps {
  children: React.ReactNode
  className?: string
}

interface TableHeaderProps {
  children: React.ReactNode
  className?: string
}

interface TableBodyProps {
  children: React.ReactNode
  className?: string
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
}

interface TableHeadProps {
  children: React.ReactNode
  className?: string
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="relative w-full overflow-auto border-[#CBD5E0] border rounded-[12px]">
      <table className={`w-full ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`[&_tr]:border-b ${className}`}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`${className}`}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={`border-b border-[#CBD5E0]  ${className}`}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className = '' }: TableHeadProps) {
  return (
    <th className={` px-6 text-left py-[12px] ${className}`}>
      {children}
    </th>
  )
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return (
    <td className={`p-6 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
      {children}
    </td>
  )
}
