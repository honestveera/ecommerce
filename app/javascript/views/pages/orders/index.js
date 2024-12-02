import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import CreateNewOrder from "./modal";
import tokenHeader from "helpers/tokenHelper";

axios.defaults.headers.common["X-CSRF-Token"] = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

const Order = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const userToken = tokenHeader();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios
      .get("/api/v1/orders",  userToken)
      .then((response) => {
        const mappedData = [];
        // Iterate through the JSON data
        response.data.items.forEach(function (item) {
          // Extract the desired values and create a new object
          const mappedItem = {
            id: item.id,
            order_type: item.order_type,
            order_number: item.order_number,
            date: item.date,
            user_id: item.user_id,
            book_name: item.book_name,
            user_name: item.user_name,
            book_id: item.book_id,
            corporate_id: item.corporate_id,
            status: item.status,
            amount: item.amount
          };
          // Push the mapped item into the mappedData array
          mappedData.push(mappedItem);
        });
        setTableData(mappedData);
        console.log(`orders data: ${mappedData}`);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const formParams = (values) => {
    const params = {
      name: values.name,
      category_id: values.category_name,
      subcategory_id: values.subcategory_name,
      author_id: values.author_name,
      publisher_id: values.publisher_name,
      isbn_number: values.isbn_number,
      user_id: 1,
    };
    return params;
  };

  const getName = (collection, name) => {
    return collection.find((i) => i.id == name).name;
  };

  const getId = (collection, name) => {
    return collection.find((i) => i.name == name).id;
  };

  const updateRowData = (values) => {
    return {
      name: values.name,
      category_name: getName(categories, values.category_name),
      subcategory_name: getName(subcategories, values.subcategory_name),
      author_name: getName(authors, values.author_name),
      publisher_name: getName(publishers, values.publisher_name),
      isbn_number: values.isbn_number,
    };
  };

  const formEditParams = (values) => {
    return {
      name: values.name,
      category_id: getId(categories, values.category_name),
      subcategory_id: getId(subcategories, values.subcategory_name),
      author_id: getId(authors, values.author_name),
      publisher_id: getId(publishers, values.publisher_name),
      isbn_number: values.isbn_number,
    };
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const params = formEditParams(values);
      axios
        .put(`/api/v1/orders/${row.original.id}`, params,  userToken)
        .then((response) => {
          values["id"] = row.original.id;
          tableData[row.index] = values;
          setTableData([...tableData]);
        })
        .catch((error) => console.error("Error Editing orders:", error));
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };


  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid = validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "order_type",
        header: "Order Type",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "order_number",
        header: "Order Number",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
      },
      {
        accessorKey: "book_name",
        header: "Book",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
      },
      {
        accessorKey: "user_name",
        header: "User",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
      },
    ],
    [getCommonEditTextFieldProps]
  );

  const editRow = (table, row) => {
    setValidationErrors({});
    table.setEditingRow(row);
  };

  const validateRequired = (value) => !!value.length;

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          "mrt-row-actions": {
            muiTableHeadCellProps: {
              align: "center",
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnordering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => editRow(table, row)}>
                <Edit />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
      <CreateNewOrder
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
};

export default Order;
