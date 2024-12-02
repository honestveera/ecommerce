import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MaterialReactTable } from "material-react-table";
import tokenHeader from "helpers/tokenHelper"; 
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import CreateNewEnquiry from "./modal";

axios.defaults.headers.common["X-CSRF-Token"] = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

const Enquiry = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const userToken = tokenHeader();

  useEffect(() => {
    axios
      .get("/api/v1/enquiries", userToken)
      .then((response) => {
        const mappedData = [];
        // Iterate through the JSON data
        response.data.items.forEach(function (item) {
          // Extract the desired values and create a new object
          const mappedItem = {
            id: item.id,
            name: item.name,
            email: item.email,
            message: item.message,
            mobile: item.mobile,
            role: item.role,
            employee_size: item.employee_size,
            company_name: item.company_name,
          };
          // Push the mapped item into the mappedData array
          mappedData.push(mappedItem);
        });
        setTableData(mappedData);
        console.log(`Enquiry data: ${mappedData}`);
      })
      .catch((error) => console.error("Error fetching Enquiries:", error));
  }, []);
  const formParams = (values) => {
    const params = {
      name: values.name,
      email: values.email,
      mobile: values.mobile,
      message: values.message,
      role: values.role,
      employee_size: values.employee_size,
      company_name: values.company_name,

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
      email: values.email,
      mobile: values.mobile,
      message: values.message,
      role: values.role,
      employee_size: values.employee_size,
      company_name: values.company_name,

    };
  };

  const formEditParams = (values) => {
    return {
      name: values.name,
      email: values.email,
      mobile: values.mobile,
      message: values.message,
      role: values.role,
      employee_size: values.employee_size,
      company_name: values.company_name,

    };
  };

  const handleCreateNewRow = (values) => {
    if (!Object.keys(validationErrors).length) {
      const params = formParams(values);
      const rowData = updateRowData(values);
      axios
        .post("/api/v1/enquiries", params, userToken)
        .then((response) => {
          rowData["id"] = response.data.id;
          setTableData([...tableData, rowData]);
        })
        .catch((error) => console.error("Error Creating Enquiries:", error));
    }
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const params = formEditParams(values);
      axios
        .put(`/api/v1/enquiries/${row.original.id}`, params, userToken)
        .then((response) => {
          values['id'] = row.original.id;
          tableData[row.index] = values;
          setTableData([...tableData]);
        })
        .catch((error) => console.error("Error Editing Enquiries:", error));
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (!confirm(`Are you sure you want to delete ${row.getValue("name")}`)) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      axios.delete(`/api/v1/enquiries/${row.original.id}`, userToken).then((response) => {
        tableData.splice(row.index, 1);
        setTableData([...tableData]);
      });
    },
    [tableData]
  );

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
        accessorKey: "name",
        header: "Enquiry Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: "email",
        header: "Email",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: "message",
        header: "Message",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: "mobile",
        header: "Mobile",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: "role",
        header: "Role",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: "employee_size",
        header: "Employee Size",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },


      {
        accessorKey: "company_name",
        header: "Company Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
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
        enableColumnOrdering
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
            <Tooltip arrow placement="right" title="Delete">
              <IconButton onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            color="secondary"
            onClick={() => setCreateModalOpen(true)}
            variant="contained"
          >
            Create New Enquiry
          </Button>
        )}
      />
      <CreateNewEnquiry
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

export default Enquiry;
