import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import Button, {ButtonProps} from "@mui/material/Button";
import {ElementType, useState} from "react";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import {List, ListItem, ListItemText} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  AlertOctagram,
  ClockTimeTwo,
  ClockTimeTwoOutline,
  EmailOutline,
  FileChartOutline,
  FormatTitle
} from "mdi-material-ui";
import {AccountBox} from "@mui/icons-material";

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({theme}) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const DownloadFile = () => {
  let [url, setUrl] = useState('');
  let [id, setId] = useState('');
  let [lookupObject, setLookupObject] = useState(undefined);

  const base64ToArrayBuffer = (base64: any) => {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  const saveByteArray = (incomingFile: any, byte: any) => {
    var blob = new Blob([byte], {type: incomingFile.contentType});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = incomingFile.title;
    link.download = fileName;
    link.click();
  };

  const requestToBlock = () => {
    const blockRequestURL = "http://localhost:8080/file_controller/request_to_block/" + id;

    const toastId = toast.loading('Requesting to block');
    axios.get(blockRequestURL).then(res => {
      toast.dismiss(toastId);
      toast.success('Done')
    });
  }

  const requestToUnblock = () => {
    const unblockRequestURL = "http://localhost:8080/file_controller/request_to_unblock/" + id;

    const toastId = toast.loading('Requesting to unlock');
    axios.get(unblockRequestURL).then(res => {
      toast.dismiss(toastId);
      toast.success('Done')
    });
  }

  const downloadFile = () => {
    const toastId = toast.loading('Downloading');
    axios.get(url).then(res => {
      console.log(res);
      toast.dismiss(toastId);
      toast.success('Downloaded Complete');

      const byteArray = base64ToArrayBuffer(res.data.uploadedFile.data);
      saveByteArray(res.data, byteArray);
    })
  }

  const lookupFile = () => {
    const objectId = url.split('download/')[1];
    setId(objectId);
    const lookupURL = "http://localhost:8080/file_controller/lookup/" + objectId;
    const toastId = toast.loading('Looking Up');

    axios.get(lookupURL).then(res => {
      toast.dismiss(toastId);
      toast.success('Done');
      setLookupObject(res.data);
    });

  }

  return(
    <Box>
      <Toaster/>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <span style={{width: '100%',display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <TextField onChange={e => setUrl(e.target.value)} sx={{ mb: '5px'}} fullWidth label='Your download link' placeholder='http://' />
        <ButtonStyled style={{width: '10%'}} onClick={lookupFile} component='button' variant='contained' htmlFor='download-image'>
          Lookup
        </ButtonStyled>
        </span>
      </Box>
      {(
        !!lookupObject &&
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5%' }}>
          <Card sx={{ width: '75%' }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Meta Information:
              </Typography>
              <List component='nav'>
                <ListItem disablePadding>
                    <ListItemIcon>
                      <FormatTitle fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={ lookupObject.title } />
                </ListItem>
                <ListItem disablePadding>
                    <ListItemIcon>
                      <ClockTimeTwo fontSize='small' />
                    </ListItemIcon>
                    <ListItemText primary={ lookupObject.createdAt } />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <FileChartOutline fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary={ lookupObject.contentType } />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <AlertOctagram fontSize='small' />
                  </ListItemIcon>
                  <ListItemText primary={ lookupObject.blockFlag ? 'Block Restricted' : 'Available to download' } />
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button onClick={downloadFile} disabled={lookupObject.blockFlag} variant='contained' size="small">Download</Button>
              <Button onClick={requestToUnblock} disabled={!lookupObject.blockFlag} variant='outlined' size="small">Request Unblock</Button>
              <Button onClick={requestToBlock} disabled={lookupObject.blockFlag} variant='outlined' size="small" color='error'>Block Request</Button>
            </CardActions>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default DownloadFile;
