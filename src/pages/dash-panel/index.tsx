import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {useEffect, useState} from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { Divider } from '@mui/material';

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const FileListTable = (props: any) => {
  const [header, setHeader] = useState(props?.header);
  const [url, setUrl] = useState(props?.url);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState(props?.fileList || []);
  console.log(props.fileList)
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  const handleAcceptOrDeny = (objectId: any, decisionFlag: any) => {
    const toastId = toast.loading('Communicating Host');
    axios.get(url + '/' + objectId + '/' + decisionFlag).then(res => {
      toast.dismiss(toastId);
      toast.success('Done');
      const filteredList = rows.filter(item => item.id !== res.data.id);
      setRows(filteredList);
    })
  }

  return (
    <>
      <Alert sx={{marginBottom: '1%'}} variant='filled' severity='info'>
        {header}
      </Alert>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableBody>
            {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : rows
            ).map((row: any) => (
              <TableRow key={row.id} style={{display: 'flex', justifyContent: 'space-between'}}>
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell component="th" scope="row" style={{display: "flex", width: '20%', justifyContent: 'space-around'}}>
                  <Button onClick={() => {
                    handleAcceptOrDeny(row.id, true);
                  }} variant='contained' color='success'>Accept</Button>
                  <Button onClick={() => {
                    handleAcceptOrDeny(row.id, false);
                  }} variant='contained' color='error'>Deny</Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

const DashPanel = () => {

  const [isAdmin, setIsAdmin] = useState(false);
  const [blockRequestList, setBlockRequestList] = useState([]);
  const [unblockRequestList, setUnblockRequestList] = useState([]);
  const [blockRequestURL, setBlockRequestURL] = useState('http://localhost:8080/file_controller/accept_or_reject_block_request');
  const [unblockRequestURL, setUnblockRequestURL] = useState('http://localhost:8080/file_controller/accept_or_reject_unblock_request');

  useEffect(() => {
    let localUser = JSON.parse(localStorage.getItem('user'));
    setIsAdmin(localUser?.adminFlag);

    if (localUser?.adminFlag) {
      let req = axios.get(`http://localhost:8080/file_controller/block_request_list`);
      toast.promise(req, {
        loading: 'Loading Block Request',
        success: (res) => {
          setBlockRequestList(res?.data);
          return 'Ready!';
        },
        error: () => {
          return 'Error!';
        },
      });

      req = axios.get(`http://localhost:8080/file_controller/unblock_request_list`);
      toast.promise(req, {
        loading: 'Loading Unblock Request',
        success: (res) => {
          setUnblockRequestList(res?.data);
          console.log(res)
          return 'Ready!';
        },
        error: () => {
          return 'Error!';
        },
      });

    }
  }, []);

  // @ts-ignore
  return (
    <>
      <Toaster position="top-center"/>
      {(blockRequestList.length > 0 ? (isAdmin ? <FileListTable header={'Block Request List'} url = {blockRequestURL} fileList = {blockRequestList}/> : <></>) : <></>)}
      <Divider/>
      {(unblockRequestList.length > 0 ? (isAdmin ? <FileListTable header={'Unblock Request List'} url = {unblockRequestURL} fileList = {unblockRequestList}/> : <></>) : <></>)}
    </>
  );
}

export default DashPanel;
