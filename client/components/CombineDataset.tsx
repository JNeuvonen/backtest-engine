import React, { useEffect, useRef, useState } from "react";
import { useDatasetsQuery } from "../clients/queries/queries";
import { createScssClassName } from "../utils/css";
import { SelectDatasetColumn } from "./SelectDatasetColumn";
import { useForceUpdate } from "../hooks/useForceUpdate";
import { Search } from "./Search";
import cloneDeep from "lodash/cloneDeep";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Button } from "@chakra-ui/react";
import { BUTTON_VARIANTS } from "../theme";
import Title from "./Title";
import { ChakraDivider } from "./Divider";
import {
  areAllNestedValuesNull,
  areAllValuesNull,
  isObjectEmpty,
  isOneNestedValueTrue,
} from "../utils/object";

interface Props {
  baseDataset: string;
  baseDatasetColumns: string[];
}

const CONTAINERS = {
  combine_datasets: "combine-datasets",
  base_dataset: "base",
  all_columns: "all-columns",
};

export type SelectedDatasetColumns = { [key: string]: boolean | null };
type ColumnsDict = { [key: string]: SelectedDatasetColumns };

export const CombineDataset = ({ baseDataset, baseDatasetColumns }: Props) => {
  const { data } = useDatasetsQuery();
  const allColumnsData = useRef<ColumnsDict>({});
  const filteredColumns = useRef<ColumnsDict>({});
  const selectedColumns = useRef<ColumnsDict>({});

  const [componentReady, setComponentReady] = useState(false);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (data) {
      allColumnsData.current = {};
      data.res.tables.map((item) => {
        allColumnsData.current[item.table_name] = {};
        item.columns.map((col) => {
          allColumnsData.current[item.table_name][col] = false;
        });
      });
      filteredColumns.current = cloneDeep(allColumnsData.current);
      setComponentReady(true);
    }
  }, [data, setComponentReady]);

  if (!data || !componentReady) {
    return <div>No datasets available</div>;
  }

  const selectFromNew = (
    tableName: string,
    columnName: string,
    newValue: boolean
  ) => {
    filteredColumns.current[tableName][columnName] = newValue;
    allColumnsData.current[tableName][columnName] = newValue;
    forceUpdate();
  };

  const selectFromAdded = (
    tableName: string,
    columnName: string,
    newValue: boolean
  ) => {
    selectedColumns.current[tableName][columnName] = newValue;
    forceUpdate();
  };

  const onDatasetSearch = (searchTerm: string) => {
    filteredColumns.current = cloneDeep(allColumnsData.current);
    if (!searchTerm) return forceUpdate();
    Object.keys(filteredColumns.current).forEach((key) => {
      if (!key.includes(searchTerm)) {
        delete filteredColumns.current[key];
      }
    });
    forceUpdate();
  };

  const insertToColumnsStateDict = (
    stateDictRef: React.MutableRefObject<ColumnsDict>,
    tableName: string,
    columnName: string
  ) => {
    if (stateDictRef.current[tableName]) {
      stateDictRef.current[tableName][columnName] = true;
    } else {
      stateDictRef.current[tableName] = {};
      stateDictRef.current[tableName][columnName] = true;
    }
  };

  const moveColumnsToBase = () => {
    for (const [key, value] of Object.entries(allColumnsData.current)) {
      for (const [colName, colValue] of Object.entries(value)) {
        if (colValue) {
          insertToColumnsStateDict(selectedColumns, key, colName);
          allColumnsData.current[key][colName] = null;
          filteredColumns.current[key][colName] = null;
        }
      }
    }
    forceUpdate();
  };

  const moveColumnsBackToNew = () => {
    for (const [key, value] of Object.entries(selectedColumns.current)) {
      for (const [colName, colValue] of Object.entries(value)) {
        if (colValue) {
          insertToColumnsStateDict(allColumnsData, key, colName);
          insertToColumnsStateDict(filteredColumns, key, colName);
          selectedColumns.current[key][colName] = null;
        }
      }
    }
    forceUpdate();
  };

  const allDatasets = data.res.tables;

  const removeFromBaseButton = () => {
    if (
      isObjectEmpty(selectedColumns.current) ||
      areAllNestedValuesNull(selectedColumns.current)
    )
      return null;
    return (
      <Button
        rightIcon={<AiOutlineRight />}
        height="32px"
        variant={BUTTON_VARIANTS.grey}
        onClick={moveColumnsBackToNew}
        style={{ marginTop: "8px" }}
      >
        Remove
      </Button>
    );
  };

  return (
    <div>
      <div className={CONTAINERS.combine_datasets}>
        <div
          className={createScssClassName([
            CONTAINERS.combine_datasets,
            CONTAINERS.base_dataset,
          ])}
        >
          <div>
            <Title
              style={{
                fontWeight: 600,
                fontSize: 17,
              }}
            >
              Base columns
            </Title>
            <ChakraDivider />
          </div>
          <div style={{ marginTop: 8 }}>
            {baseDatasetColumns.map((item) => {
              return <div key={item}>{item}</div>;
            })}
          </div>
          <div style={{ marginTop: 16 }}>
            <Title
              style={{
                fontWeight: 600,
                fontSize: 17,
              }}
            >
              New columns
            </Title>
            <ChakraDivider />
          </div>
          {removeFromBaseButton()}
          <div>
            {allDatasets.map((item, i) => {
              const columns = selectedColumns.current[item.table_name];

              if (
                !columns ||
                Object.values(columns).every((value) => value === null)
              )
                return null;
              return (
                <SelectDatasetColumn
                  defaultOpen={true}
                  dataset={item}
                  key={i}
                  style={i !== 0 ? { marginTop: 16 } : undefined}
                  selectedColumns={columns}
                  selectColumn={selectFromAdded}
                />
              );
            })}
          </div>
        </div>
        <div
          className={createScssClassName([
            CONTAINERS.combine_datasets,
            CONTAINERS.all_columns,
          ])}
        >
          <div>
            <Button
              leftIcon={<AiOutlineLeft />}
              height="32px"
              variant={BUTTON_VARIANTS.grey}
              onClick={moveColumnsToBase}
              isDisabled={!isOneNestedValueTrue(filteredColumns.current)}
            >
              Add
            </Button>
            <Search
              onSearch={onDatasetSearch}
              placeholder="Search for dataset"
              searchMode="onChange"
              style={{
                width: "300px",
                marginBottom: "8px",
                height: "32px",
                marginTop: "8px",
              }}
            />
          </div>
          <div>
            {allDatasets.map((item, i) => {
              const columns = filteredColumns.current[item.table_name];
              if (!columns || areAllValuesNull(columns)) return null;
              return (
                <SelectDatasetColumn
                  dataset={item}
                  key={i}
                  style={i !== 0 ? { marginTop: 16 } : undefined}
                  selectedColumns={filteredColumns.current[item.table_name]}
                  selectColumn={selectFromNew}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
