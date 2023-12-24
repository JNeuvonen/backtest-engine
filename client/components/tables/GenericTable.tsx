import React from "react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

interface Props {
  columns: string[];
  columnOnClickFunc?: (item: string) => void;
  rows: any[];
}

export const GenericTable = ({ columns, rows, columnOnClickFunc }: Props) => {
  return (
    <div style={{ overflowX: "auto" }} className="custom-scrollbar">
      <Table variant="simple" className="basic-table">
        <Thead>
          <Tr>
            {columns.map((item) => {
              return (
                <Th
                  key={item}
                  className={"table-th-hover"}
                  onClick={() => {
                    if (!columnOnClickFunc) return;
                    columnOnClickFunc(item);
                  }}
                >
                  {item}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((item, i) => {
            return (
              <Tr key={i}>
                {item.map((rowItem: any, j: number) => {
                  return <Td key={`${i}-${j}`}>{rowItem}</Td>;
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
};