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
import CreateNewAssignOrder from "./modal";
import tokenHeader from "helpers/tokenHelper";

axios.defaults.headers.common["X-CSRF-Token"] = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

const AssignOrder = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deliveryPartner, setdeliveryPartner] = useState({});
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const userToken = tokenHeader();

  useEffect(() => {
    axios
      .get("/api/v1/orders?status=ORDERED", userToken)
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
            status: item.status
          };
          // Push the mapped item into the mappedData array
          mappedData.push(mappedItem);
        });
        setTableData(mappedData);
        console.log(`New Orders data: ${mappedData}`);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);


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
          require: true
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
        accessorKey: "delivery_partner",
        header: "Delivery Partner",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 80,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: ['ORDER_ASSIGNED'].map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          )),
        }
      }
    ],
    [getCommonEditTextFieldProps]
  );

  const editRow = (table, row) => {
    setValidationErrors({});
    axios.get('/api/v1/users?role=DeliveryPartner', userToken)
    .then(response => {
      // Handle the successful response here
      console.log('Users:', response.data);
      setdeliveryPartner(response.data);
    })
    .catch(error => {
      // Handle errors here
      console.error('Error fetching users:', error);
    });
    setCreateModalOpen(true);
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
      <CreateNewAssignOrder
        columns={columns}
        open={createModalOpen}
        deliveryPartner={deliveryPartner}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
};

export default AssignOrder;
