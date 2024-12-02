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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import tokenHeader from "helpers/tokenHelper";
import userData from "helpers/userHelper";

axios.defaults.headers.common["X-CSRF-Token"] = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

const DeliveryPartner = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const userToken = tokenHeader();
  const currentUser = userData();

  useEffect(() => {
    const url = "/api/v1/users?role=DeliveryPartner";
    const corporateParam = `corporate_id=${currentUser.corporate_id}`; 
    const path = currentUser.role == 'SuperAdmin' ? url : `${url}&${corporateParam}`;

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
            company_name: item.company_name
          };
          // Push the mapped item into the mappedData array
          mappedData.push(mappedItem);
        });
        setTableData(mappedData);
        console.log(`Users data: ${mappedData}`);
      })
      .catch((error) => console.error("Error fetching Users:", error));
    }, []);

  // const handleApproveRow = useCallback(
  //   (row) => {
  //     if (!confirm(`Are you sure you want to approve ${row.getValue("first_name")} ${row.getValue("last_name")}`)) {
  //       return;
  //     }
  //     //send api delete request here, then refetch or update local table data for re-render
  //     axios.put(`/api/v1/users/${row.original.id}/company_approval`, { approved: true }, userToken).then((response) => {
  //       tableData.splice(row.index, 1);
  //       setTableData([...tableData]);
  //     });
  //   },
  //   [tableData]
  // );

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
        accessorKey: "company_name",
        header: "Company",
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        })
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
        // renderRowActions={({ row, table }) => (
        //   <Box sx={{ display: "flex", gap: "1rem" }}>
        //     <Tooltip arrow placement="right" title="Approve">
        //       <IconButton style={{ color: 'green' }} onClick={() => handleApproveRow(row)}>
        //        <PersonAddIcon />
        //       </IconButton>
        //     </Tooltip>
        //   </Box>
        // )}
      />
    </>
  );
};

export default DeliveryPartner;
