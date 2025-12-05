"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDownIcon, ChevronRightIcon } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  cell: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  getRowKey: (item: T) => string;
  selectable?: boolean;
  selectedItems?: string[];
  onSelectItem?: (id: string) => void;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
  expandable?: boolean;
  renderExpandedContent?: (item: T) => React.ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "Tidak ada data",
  getRowKey,
  selectable = false,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  isAllSelected = false,
  expandable = false,
  renderExpandedContent,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(
    new Set()
  );

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const totalColumns =
    columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {expandable && <TableHead className="w-[50px]"></TableHead>}
            {selectable && (
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected && data.length > 0}
                  onCheckedChange={onSelectAll}
                  disabled={isLoading || data.length === 0}
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={totalColumns}
                className="text-center py-8 text-muted-foreground"
              >
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={totalColumns}
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const rowKey = getRowKey(item);
              const isExpanded = expandedRows.has(rowKey);
              return (
                <React.Fragment key={rowKey}>
                  <TableRow>
                    {expandable && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toggleRow(rowKey)}
                        >
                          {isExpanded ? (
                            <ChevronDownIcon className="w-4 h-4" />
                          ) : (
                            <ChevronRightIcon className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    )}
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(rowKey)}
                          onCheckedChange={() => onSelectItem?.(rowKey)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.key} className={column.className}>
                        {column.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandable && isExpanded && renderExpandedContent && (
                    <TableRow>
                      <TableCell
                        colSpan={totalColumns}
                        className="bg-muted/30 p-4"
                      >
                        {renderExpandedContent(item)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
