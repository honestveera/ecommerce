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
  import CreateNewBook from "./modal";
  import exportFromJSON from "export-from-json";
  import tokenHeader from "helpers/tokenHelper";
  import Modal from 'react-modal';
  import {  importBook, exportBook} from "./import_export_book";
  import Loader from '../../../ui-component/Loader';

  Modal.setAppElement('#root');

  axios.defaults.headers.common["X-CSRF-Token"] = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const Book = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const userToken = tokenHeader();
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageValue ,setValues] = useState([])
    const [loader,setLoader] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    loadBooks();
    axios
      .get("/api/v1/authors", userToken)
      .then((response) => setAuthors(response.data.items))
      .catch((error) => console.error("Error fetching authors:", error));
    axios
      .get("/api/v1/publishers", userToken)
      .then((response) => {
        setPublishers(response.data.items);
      })
      .catch((error) => console.error("Error fetching publishers:", error));
    axios
      .get("/api/v1/categories", userToken)
      .then((response) => {
        console.log(`Categories: ${response.data}`);
        setCategories(response.data.items);
      })
      .catch((error) => console.error("Error fetching Categories:", error));
    axios
      .get("/api/v1/subcategories", userToken)
      .then((response) => setSubcategories(response.data.items))
      .catch((error) => console.error("Error fetching Subcategories:", error));
  }, []);

  const loadBooks = (exitEditingMode) => {
    axios
      .get("/api/v1/books",  userToken)
      .then((response) => {
        const mappedData = [];
        // Iterate through the JSON data
        response.data.items.forEach(function (item) {
          // Extract the desired values and create a new object
          const mappedItem = {
            id: item.id,
            name: item.name,
            category_id: item.category.id,
            subcategory_id: item.subcategory.id,
            author_id: item.author.id,
            publisher_id: item.publisher.id,
            category_name: item.category.name,
            subcategory_name: item.subcategory.name,
            publisher_name: item.publisher.name,
            author_name: item.author.name,
            isbn_number: item.isbn_number,
            image_name: item.image_name,
            overview: item.overview,
          };
          // Push the mapped item into the mappedData array
          mappedData.push(mappedItem);
        });
        console.log(`Books data: ${mappedData}`);
        setTableData(mappedData);
        if(exitEditingMode){exitEditingMode()}
      })
      .catch((error) => console.error("Error fetching Books:", error));
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
      category_id: values.category_name,
      subcategory_id: values.subcategory_name,
      author_id: values.author_name,
      publisher_id: values.publisher_name,
      isbn_number: values.isbn_number,
      user_id: 1,
      image_name: values.image_name,
      overview: values.overview,
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
      image_name: values.image_name,
      overview: values.overview,
    };
  };
  const formEditParams = (values,updatedFormData) => {
    return {
      name: values.name,
      category_id: getId(categories, values.category_name),
      subcategory_id: getId(subcategories, values.subcategory_name),
      author_id: getId(authors, values.author_name),
      publisher_id: getId(publishers, values.publisher_name),
      isbn_number: values.isbn_number,
      image_name: updatedFormData.image_name,
      overview: values.overview,  
    };
  };

  const handleCreateNewRow = (values) => {
    if (!Object.keys(validationErrors).length) {
      const params = formParams(values);
      const rowData = updateRowData(values);
        axios
          .post("/api/v1/books", params, userToken)
          .then((response) => {
            rowData["id"] = response.data.book.id;
            tableData.push(rowData);
            setTableData([...tableData]);
            loadBooks();
          })
          .catch((error) => console.error("Error Creating Books:", error));
      }
    };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    setLoader(true)
    if (imageValue.image) {
     
      const formData = new FormData();
      formData.append("image", imageValue.image);

      try {
        const response = await fetch("/api/v1/books/upload", {
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
              .put(`/api/v1/books/${row.original.id}`, params, userToken)
              .then(async (response) => {
                values["id"] = row.original.id;
                tableData[row.index] = values;
                setTableData([...tableData]);
                loadBooks(exitEditingMode);
                setLoader(false)
              })
              .catch((error) => console.error("Error Editing Books:", error));
          }
        } else {
          console.error('Error uploading image:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      if (!Object.keys(validationErrors).length) {
        const params = formEditParams(values, { image_name: row.original.image_name });
        axios
          .put(`/api/v1/books/${row.original.id}`, params, userToken)
          .then((response) => {
            values["id"] = row.original.id;
            tableData[row.index] = values;
            setTableData([...tableData]);
            loadBooks(exitEditingMode);
            setLoader(false)
          })
          .catch((error) => console.error("Error Editing Books:", error));
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
      axios.delete(`/api/v1/books/${row.original.id}`, userToken).then((response) => {
        tableData.splice(row.index, 1);
        setTableData([...tableData]);
      });
    },
    [tableData]
  );

   const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      console.log('cell.image_name inside getCommonEditTextFieldProps:', cell.image_name); // Log the value here
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

  const handleImport = ($event) => {
    importBook($event.target.files[0], userToken)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onExportRemoteData = () => {
    exportBook(userToken)
      .then((result) => {
        exportFromJSON(result);
      })
      .catch((error) => {
        console.error(error);
      });
  };
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
        header: 'Image URL',
        size: 100,
        muiTableBodyCellEditTextFieldProps: ({ cell}) => ({
          ...getCommonEditTextFieldProps(cell),
          type: "file",
          onChange: handleImageChange,
          value:cell.image_name
        }),
        Cell: ({ row }) => {
          const displayText = row.original.image_name;
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
        })
      },
      {
        accessorKey: "category_name",
        header: "Category",
        size: 140,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: categories.map((state) => (
            <MenuItem key={state.id} value={state.name}>
             {state.name}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "subcategory_name",
        header: "Sub Category",
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: subcategories.map((state) => (
            <MenuItem key={state.id} value={state.name}>
              {state.name}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "author_name",
        header: "Author",
        size: 80,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: authors.map((state) => (
            <MenuItem key={state.id} value={state.name}>
              {state.name}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "publisher_name",
        header: "Publisher",
        size: 80,
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: publishers.map((state) => (
            <MenuItem key={state.id} value={state.name}>
              {state.name}
            </MenuItem>
          )),
        },
      },

      {
        accessorKey: "isbn_number",
        header: "ISBN Number",
        size: 80,
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="file"
                name="file"
                className="custom-file-input"
                id="inputGroupFile"
                required
                onChange={handleImport}
                accept=".zip,multipart/form-data"
                style={{ display: 'none' }} // Hide the input element
              />
              <label htmlFor="inputGroupFile">
                <Button component="span" variant="contained" color="primary">
                  Import file
                </Button>
              </label>
              <Button
              color="secondary"
              onClick={() => setCreateModalOpen(true)}
              variant="contained"
              style={{ marginLeft: '1rem' }}
            >
              Create New Book
            </Button>
            </div>
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
        <Button onClick={onExportRemoteData}>Export</Button>
        <CreateNewBook
          columns={columns}
          authors={authors}
          publishers={publishers}
          categories={categories}
          subcategories={subcategories}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />
        { loader &&
          <Loader />
        }
      </>
    );
  };
  export default Book;
