import React from "react";




import { darken, lighten, styled } from '@mui/material/styles';

import { Box, Pagination, PaginationItem } from "@mui/material";
import {
  DataGrid,
  GridColumnHeaders,
  GridRow,
  GridToolbar,
  GridToolbarQuickFilter,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";


function QuickSearchToolbar() {
  return (
    <Box
      sx={{
      p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) =>
          searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
      />
    </Box>
  );
}




export default function DataTable({ data, columns, id } ) {
  //custom
  const localizedTextsMap = {
    toolbarColumns: "dsadsadsad",
    columnsPanelTextFieldLabel: "Find column 1",
    columnMenuUnsort: "não classificado",
    columnMenuSortAsc: "Classificar por ordem crescente",
    columnMenuSortDesc: "Classificar por ordem decrescente",
    columnMenuFilter: "Filtro",
    columnMenuHideColumn: "Ocultar",
    columnMenuShowColumns: "Mostrar colunas",
  };
  const PAGE_SIZE = 15;
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: PAGE_SIZE,
    page: 0,
  });
  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
    return (
      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        page={page + 1}
        count={pageCount}
        // @ts-expect-error
        renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }

  
  return (
    <div className="container">
      <div className="row">
        {data ? (
          <div className="col-12">
            <div className="card card-body">
              <div className="table-responsive">
                <Box sx={{ height: 700, width: "100%" }}>
                  <DataGrid
                         
                         sx={{
                          boxShadow: 2,
                          border: 2,
                          borderColor: 'primary.light',
                          '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                          },
                          '& .super-app-theme--header': {
                            backgroundColor: 'rgba(255, 7, 0, 0.55)',
                          },
                          
                        }}
                    rows={data}
                    getRowId={(row) => row[id]}
                    columns={columns.map(col => ({ ...col, headerName: `${col.headerName} 💔` }))} // Example adding a custom `headerName`
                    columnGroupsHeaderStructure={(row) => row[id]}
                    // slots={{
                    //   toolbar: 
                    //     GridToolbarQuickFilter,
                    //     GridToolbar
                      
                    // }}
                    // initialState={{
                    //   pagination: {
                    //     paginationModel: {
                    //       pageSize: 20,
                    //     },
                    //   },
                    //   pinnedColumns: { left: ['name'], right: ['action11s'] } 
                    // }}
                    getRowClassName={(params) => `super-app-theme--${params.row.status}`}

                    // pageSizeOptions={[20]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[PAGE_SIZE]}
                    slots={{
                      pagination: CustomPagination,
                      toolbar: GridToolbar,
                    }}
                    disableRowSelectionOnClick
                  >
                 
                   
              
                  </DataGrid >
                </Box>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-lime-200 block w-12 h-24 bg-red-700">Đang tải</p>
        )}
      </div>
    </div>
  );
}
