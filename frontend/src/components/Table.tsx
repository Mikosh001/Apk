import { ReactNode } from 'react';

type Props = {
  headers: string[];
  rows: ReactNode[][];
};

export const Table = ({ headers, rows }: Props) => (
  <table className="table">
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header} scope="col">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((cells, rowIndex) => (
        <tr key={rowIndex}>
          {cells.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
