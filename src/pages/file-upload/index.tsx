import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
import Button, {ButtonProps} from "@mui/material/Button";
import {ChangeEvent, ElementType, SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import Alert from "@mui/material/Alert";
import * as React from "react";
import {ContentCopy} from "@mui/icons-material";

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))


const FileUploadUI = () => {
  const [fileToBeUploaded, setFileToBeUploaded] = useState<any>([]);
  const [fileUrlAfterDone, setFileUrlAfterDone] = useState('');
  const [doneFlag, setDoneFlag] = useState(false);

  const url = 'http://localhost:8080/file_controller/download/';

  const onChange = (e: any) => {
    let fileList: any[] = [];
    // @ts-ignore
    Object.entries(e.target.files).map(file => fileList.push(file))

    setFileToBeUploaded(fileList);
  }

  const onUpload = async () => {
    setDoneFlag(false);
    setFileUrlAfterDone('');
    let tempPayload = fileToBeUploaded;
    setFileToBeUploaded([]);

    let formData = new FormData();
    for(let idx = 0; idx < fileToBeUploaded.length; idx++) {
      formData.append('files', fileToBeUploaded[idx][1])
    }

    const req = axios.post(`http://localhost:8080/file_controller/upload_file`, formData);
    await toast.promise(req, {
      loading: 'Uploading',
      success: (res) => {
        setDoneFlag(true);
        const urlToFile = url + res.data[0].id;
        setFileUrlAfterDone(urlToFile);

        return 'Upload successful!';
      },
      error: () => {
        setFileToBeUploaded(tempPayload);
        return 'Failed to upload.';
      },
    });
  }

  const handleOnCopyToClipBoard = () => {
    navigator.clipboard.writeText(fileUrlAfterDone).then(() => {
      // Alert the user that the action took place.
      // Nobody likes hidden stuff being done under the hood!
      toast.success('URL Copied to Clipboard!');
    });
  }

  useEffect(() => {
    console.log(fileToBeUploaded);
  })

  return (
    <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
      <Toaster/>
      <Box>
        <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
          Select File
          <input
            hidden
            type='file'
            onChange={onChange}
            accept="file_extension | audio/* | video/* | image/* | media_type"
            id='account-settings-upload-image'
          />
        </ButtonStyled>
        <Typography variant='body2' sx={{marginTop: 5}}>
          Allowed any file type. Max size of 10 MB.
        </Typography>
      </Box>
      <Box sx={{ paddingTop: '5%' }}>
        <Button disabled={fileToBeUploaded.length === 0} onClick={onUpload} type='submit' variant='contained' size='large'>
          Upload
        </Button>
      </Box>
      {(
      doneFlag &&
      <Box sx={{ paddingTop: '5%', width: '100%', display: 'flex' }}>
        <Alert sx={{ width: '100%' }} severity='info'>
          Download Link: {fileUrlAfterDone}
        </Alert>
        <Button onClick={handleOnCopyToClipBoard}>
          <ContentCopy/>
        </Button>
      </Box>
      )}
    </Box>
  );
}

export default FileUploadUI;
