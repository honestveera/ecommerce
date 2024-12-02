import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

//example of creating a mui dialog modal for creating new rows
const CreateNewBook = ({
  open,
  columns,
  corporates,
  roles,
  gender,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ""] = "";
      return acc;
    }, {})
  );
  const [errors, setErrors] = useState({});
  // const updatedColumns = columns.push({
  //   accessorKey: "password",
  //   header: "Password",
  //   size: 140
  // })

  const validateForm = (values) => {
    const newErrors = {};
    if (!values.first_name) {
      newErrors.first_name = "First name is required.";
    }

    if (!values.last_name) {
      newErrors.last_name = "Last name is required.";
    }

    if (!values.email) {
      newErrors.email = "Email is required.";
    }

    if (!values.role) {
      newErrors.role = "Role is required.";
    }

    if (!values.company_name) {
      newErrors.company_name = "Corporate is required.";
    }

    if (!values.password) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm(values)) {
      onSubmit(values);
      setValues([]);
      onClose();
    }
  };

  const updateMenus = (accessorKey) => {
    if (accessorKey === "company_name") {  
      return corporates.map((state) => (
        <MenuItem key={state.id} value={state.id}>
          {state.name}
        </MenuItem>
      ));
    } else if (accessorKey === "role") {
      return roles.map((state) => (
        <MenuItem key={state} value={state}>
          {state}
        </MenuItem>
      ));
    }
    else if (accessorKey === "gender") {
      return gender.map((state) => (
        <MenuItem key={state} value={state}>
          {state}
        </MenuItem>
      ));
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New User</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) =>
              column.accessorKey === "role" ||
              column.accessorKey === "gender" ||
              column.accessorKey === "company_name" ? (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  select={true}
                  error={errors[column.accessorKey]}
                  helperText={errors[column.accessorKey]}
                  onChange={(e) => handleChange(e)}
                >
                  {updateMenus(column.accessorKey)}
                </TextField>
              ) : (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  error={errors[column.accessorKey]}
                  helperText={errors[column.accessorKey]}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                ></TextField>
              )
            )}
            <TextField
                  key='password'
                  label='Password'
                  name='password'
                  error={errors['password']}
                  helperText={errors['password']}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                ></TextField>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Create New User
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateNewBook;
