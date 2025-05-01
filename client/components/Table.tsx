import React from "react";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-2xl overflow-hidden shadow-md">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((col, index) => (
              <th
                key={"columns"+index}
                className="text-left px-6 py-3 border-b font-semibold"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm text-gray-800">
          {data.map((item, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50 transition-colors duration-150">
              {columns.map((col, colIdx) => {
                return (
                  <td key={"table"+colIdx} className="px-6 py-3 border-b">
                    {col.render ? col.render(item) : colIdx == 0 ? rowIdx + 1 : (item as any)[col.key]}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
