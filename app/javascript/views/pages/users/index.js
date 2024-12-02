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
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import CreateNewUser from "./modal";
import tokenHeader from "helpers/tokenHelper";
import userData from "helpers/userHelper";

axios.defaults.headers.common["X-CSRF-Token"] = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

const User = ( { flag } ) => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [corporates, setCorporates] = useState([]);
  const userToken = tokenHeader();
  const currentUser = userData();
  const roles = currentUser.role == 'SuperAdmin' ? ['Admin', 'DeliveryPartner', 'Employee'] : ['Employee']
  const gender = ['Male', 'Female', 'Other'];

  useEffect(() => {
    const url = "/api/v1/users";
    const corporateUrl = "/api/v1/corporates";
    const corporateParam = `?corporate_id=${currentUser.corporate_id}`;  
    const queryParams = flag == 'approved' ? `${corporateParam}&corporate_flag=true` : `${corporateParam}&corporate_flag=false`
    const path = currentUser.role == 'SuperAdmin' ? url : `${url}${queryParams}`;
    const corporatePath = currentUser.role == 'SuperAdmin' ? corporateUrl : `${corporateUrl}/${currentUser.corporate_id}`

    axios
      .get(path,  userToken)
      .then((response) => {
        const mappedData = [];
        // Iterate through the JSON data
        response.data.items.forEach(function (item) {
          // Extract the desired values and create a new object
          const mappedItem = {
            id: item.id,
            first_name: item.first_name,
            last_name: item.last_name,
            email: item.email,
            country: item.country,
            gender: item.gender,
            age: item.age,
            company_name: item.company_name,
            role: item.role
          };
          // Push the mapped item into the mappedData array
          mappedData.push(mappedItem);
        });
        setTableData(mappedData);
        console.log(`Users data: ${mappedData}`);
      })
      .catch((error) => console.error("Error fetching Users:", error));

      axios
      .get(corporatePath, userToken)
      .then((response) => {    
        currentUser.role == 'SuperAdmin' ? setCorporates(response.data.items) : setCorporates([response.data])  
      })
      .catch((error) => console.error("Error fetching Corporates:", error));
    }, []);

  const formParams = (values) => {
    const params = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      country: values.country,
      gender: values.gender,
      age: values.age,
      corporate_id: getId(corporates, values.company_name),
      role: values.role,
      password: values.password
    };
    return params;
  };

  const getName = (collection, id) => {  
    return collection.find((i) => i.id == id).name;
  };

  const getId = (collection, id) => {  
    return collection.find((i) => i.id == id).id;
  };

  const updateRowData = (values) => {
    return {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      country: values.country,
      gender: values.gender,
      age: values.age,
      company_name: getName(corporates, values.company_name),
      role: values.role
    };
  };

  const formEditParams = (values) => {
    return {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      country: values.country,
      gender: values.gender,
      age: values.age,
      corporate_id: getId(corporates, values.company_name),
      role: values.role,
      password: values.password
    };
  };

  const handleCreateNewRow = (values) => {
    if (!Object.keys(validationErrors).length) {
      const params = formParams(values);
      const rowData = updateRowData(values);
      axios
        .post("/api/v1/signup", { "user": params }, userToken)
        .then((response) => {
          rowData["id"] = response.data.data.id;
          tableData.push(rowData);
          setTableData([...tableData]);
        })
        .catch((error) => console.error("Error Creating Users:", error));
    }
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const params = formEditParams(values);
      axios
        .put(`/api/v1/users/${row.original.id}`, params,  userToken)
        .then((response) => {
          values["id"] = row.original.id;
          tableData[row.index] = values;
          setTableData([...tableData]);
        })
        .catch((error) => console.error("Error Editing Users:", error));
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (!confirm(`Are you sure you want to delete ${row.getValue("email")}`)) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      axios.delete(`/api/v1/users/${row.original.id}`, userToken).then((response) => {
        tableData.splice(row.index, 1);
        setTableData([...tableData]);
      });
    },
    [tableData]
  );

  const handleUnapproveRow = useCallback(
    (row) => {  
      if (!confirm(`Are you sure you want to unapprove ${row.getValue("first_name")} ${row.getValue("last_name")}`)) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      axios.put(`/api/v1/users/${row.original.id}/company_approval`, { approved: false }, userToken).then((response) => {
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
        accessorKey: "first_name",
        header: "First Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "last_name",
        header: "Last Name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "email",
        header: "Email",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "country",
        header: "Country",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
      },
      {
        accessorKey: "age",
        header: "Age",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 80,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: gender.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "role",
        header: "Role",
        size: 80,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: roles.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "company_name",
        header: "Company",
        size: 80,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: corporates.map((state) => (
            <MenuItem key={state.id} value={state.name}>
              {state.name}
            </MenuItem>
          )),
        },
      }],
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
          { 
            flag == 'approved' ?
            <Tooltip arrow placement="left" title="Unapprove">
              <IconButton style={{ color: 'red' }} onClick={() => handleUnapproveRow(row)}>
                <PersonRemoveIcon />
              </IconButton>
            </Tooltip>
            : ''
          }
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
            Create New User
          </Button>
        )}
      />
      <CreateNewUser
        columns={columns}
        corporates={corporates}
        roles={roles}
        gender={gender}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};

export default User;
