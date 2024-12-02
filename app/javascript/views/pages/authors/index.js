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
import CreateNewAuthor from "./modal";
import Modal from 'react-modal';
import Loader from '../../../ui-component/Loader';

Modal.setAppElement('#root');

axios.defaults.headers.common["X-CSRF-Token"] = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

const Author = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [authors, setAuthors] = useState([]);
  const userToken = tokenHeader();
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageValue ,setValues] = useState([])
  const [loader,setLoader] = useState(false)

  useEffect(() => {
  loadAuthors();
  }, []);

  const loadAuthors =(exitEditingMode)=>{
    axios
      .get("/api/v1/authors", userToken)
      .then((response) => {
        const mappedData = [];
        // Iterate through the JSON data
        response.data.items.forEach(function (item) {
          // Extract the desired values and create a new object
          const mappedItem = {
            id: item.id,
            name: item.name,
            image_name: item.image_name,
            biography: item.biography,
      
          };
          // Push the mapped item into the mappedData array
          mappedData.push(mappedItem);
        });
        setTableData(mappedData);
        console.log(`Books data: ${mappedData}`);
        if(exitEditingMode){exitEditingMode()}
      })
      .catch((error) => console.error("Error fetching Authors:", error));
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValues((prevValues) => ({
        ...prevValues,
        image: file,
      }));
    }
  };

  const formParams = (values) => {
    const params = {
      name: values.name,
      image_name: values.image_name,
      biography: values.biography,
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
      image_name: values.image_name,
      biography: values.biography,
    };
  };

  const formEditParams = (values,updatedFormData) => {
    return {
      name: values.name,
      image_name: updatedFormData.image_name,
      biography: values.biography,
    };
  };

  const handleCreateNewRow = (values) => {

    if (!Object.keys(validationErrors).length) {
      const params = formParams(values);
      const rowData = updateRowData(values);
      axios
        .post("/api/v1/authors", params, userToken)
        .then((response) => {
          rowData["id"] = response.data.id;
          setTableData([...tableData, rowData]);
          loadAuthors();
        })
        .catch((error) => console.error("Error Creating Authors:", error));
    }
  };

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
      setLoader(true)
      if (imageValue.image) {
        const formData = new FormData();
        formData.append("image", imageValue.image);

        try {
          const response = await fetch("/api/v1/authors/upload", {
            method: "POST",
            body: formData,
            ...userToken,
          });

          if (response.ok) {
            const data = await response.json();
            const imagePath = data.filePath;
            const updatedFormData = { ...imageValue, image_name: imagePath || "/uploads/noimage.png" };

            if (!Object.keys(validationErrors).length) {
              const params = formEditParams(values, updatedFormData);
              axios
                .put(`/api/v1/authors/${row.original.id}`, params, userToken)
                .then((response) => {
                  values["id"] = row.original.id;
                  tableData[row.index] = values;
                  setTableData([...tableData]);
                   loadAuthors(exitEditingMode);
                   setLoader(false)
                })
                .catch((error) => console.error("Error Editing Authors:", error));
            }
          } else {
            console.error('Error uploading image:', response.statusText);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      } else {
    if (!Object.keys(validationErrors).length) {
      const params = formEditParams(values,{ image_name: row.original.image_name });
      axios
        .put(`/api/v1/authors/${row.original.id}`, params, userToken)
        .then((response) => {
          values['id'] = row.original.id;
          tableData[row.index] = values;
          setTableData([...tableData]);
          loadAuthors(exitEditingMode);
          setLoader(false)
        })
        .catch((error) => console.error("Error Editing Author:", error));
    }
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
      axios.delete(`/api/v1/authors/${row.original.id}`, userToken).then((response) => {
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

  const openImageModal = (imageUrl) => {
    const imagePath = `${imageUrl}`;
    setSelectedImageUrl(imagePath);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImageUrl('');
    setIsImageModalOpen(false);
  };

  const columns = useMemo(
    () => [
        {
          accessorKey: 'image_name',
          header: 'Image Name',
          size: 80,
          muiTableBodyCellEditTextFieldProps: ({ cell}) => ({
            ...getCommonEditTextFieldProps(cell),
            type: "file",
            onChange: handleImageChange,
            value:cell.image_name
          }),
          Cell: ({ row }) => {
            const displayText = row.original.image_name
            return (
              <span
                style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => openImageModal(row.original.image_name)}
              >
                {displayText}
              </span>
            );
          },
        },

        {
          accessorKey: "name",
          header: "Name",
          size: 140,
          muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
            ...getCommonEditTextFieldProps(cell),
          }),
        },

        {
          accessorKey: "biography",
          header: "Biography",
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
            Create New Author
          </Button>
        )}
      />

  <Modal
  isOpen={isImageModalOpen}
  onRequestClose={closeImageModal}
  contentLabel="Image Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    content: {
      maxWidth: '50%',
      maxHeight: '70vh',
      margin: 'auto',
      background: '#fff',
      borderRadius: '8px',
      padding: '10px',
      border: 'none',
      boxShadow: 'none',
    },
  }}
>
  {selectedImageUrl && (
    <img
      src={selectedImageUrl}
      alt="Selected Image"
      style={{
        width: '100%',
        height: '50%',
        objectFit: 'contain',
        borderRadius: '8px',
      }}
    />
  )}
</Modal>
      <CreateNewAuthor
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
      {loader &&
      <Loader/>}
    </>
  );
};

export default Author;
