import React from 'react';
import { Wallet, ArrowDown, ArrowUp, ArrowLeftRight, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Transaction } from '@/services/transactionsApi';
import { cn } from '@/lib/utils';
import { formatCurrency as formatCurrencyUtil } from '@/utils/formatters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  onSelect?: (transaction: Transaction) => void;
  showActions?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  limit, 
  onEdit, 
  onDelete, 
  onSelect,
  showActions = true
}) => {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  // Wrapper to handle string amounts and absolute values
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return formatCurrencyUtil(Math.abs(numAmount));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowDown className="h-4 w-4 text-finance-green" />;
      case 'expense':
        return <ArrowUp className="h-4 w-4 text-finance-red" />;
      case 'transfer':
        return <ArrowLeftRight className="h-4 w-4 text-blue-500" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-1">
      {displayTransactions.length > 0 ? (
        displayTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              "flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0",
              onSelect && "cursor-pointer hover:bg-gray-50 transition-colors rounded px-2"
            )}
            onClick={() => onSelect && onSelect(transaction)}
          >
            <div className="flex items-center flex-grow">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium text-sm">{transaction.description || transaction.category_name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(transaction.transaction_date)} • {transaction.account_name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className={cn(
                "font-medium mr-4",
                transaction.type === 'income' ? "text-finance-green" : 
                transaction.type === 'transfer' ? "text-blue-500" : "text-finance-red"
              )}>
                {transaction.type === 'income' ? '+' : 
                transaction.type === 'transfer' ? '↔' : '-'}{formatCurrency(transaction.amount)}
              </div>
              
              {showActions && (onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onEdit(transaction);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(transaction);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="py-4 text-center text-muted-foreground">No transactions found</div>
      )}
    </div>
  );
};

export default TransactionList;
