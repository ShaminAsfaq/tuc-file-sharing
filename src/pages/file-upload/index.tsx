import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {styled} from "@mui/material/styles";
import Button, {ButtonProps} from "@mui/material/Button";
import {ChangeEvent, ElementType, SetStateAction, useEffect, useState} from "react";
import axios from "axios";

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))


const FileUploadUI = () => {
  const [fileToBeUploaded, setFileToBeUploaded] = useState<any>([]);

  const onChange = (e: any) => {
    let fileList: any[] = [];
    // @ts-ignore
    Object.entries(e.target.files).map(file => fileList.push(file))

    setFileToBeUploaded(fileList);
  }

  const onUpload = async () => {
    let formData = new FormData();
    for(let idx = 0; idx < fileToBeUploaded.length; idx++) {
      formData.append('files', fileToBeUploaded[idx][1])
    }
    await axios.post(`http://localhost:8080/photo_controller/upload_photo`, formData);
  }

  useEffect(() => {
    console.log(fileToBeUploaded);
  })

  return (
    <Box sx={{display: 'flex', alignItems: 'flex-start', flexDirection: 'column'}}>
      <Box>
        <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
          Upload New Photo
          <input
            hidden
            type='file'
            onChange={onChange}
            // accept='image/png, image/jpeg'
            id='account-settings-upload-image'
          />
        </ButtonStyled>
        <Typography variant='body2' sx={{marginTop: 5}}>
          Allowed PNG or JPEG. Max size of 800K.
        </Typography>
      </Box>
      <Box sx={{ paddingTop: '5%' }}>
        <Button disabled={fileToBeUploaded.length === 0} onClick={onUpload} type='submit' variant='contained' size='large'>
          Upload
        </Button>
      </Box>
    </Box>
  );
}

export default FileUploadUI;
