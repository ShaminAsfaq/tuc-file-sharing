// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import FileUploadUI from "../../pages/file-upload";
import {Attachment, DownloadOutline, Upload} from "mdi-material-ui";
import {DownloadDoneOutlined} from "@mui/icons-material";
import {useEffect, useState} from "react";

const navigation = (): VerticalNavItemsType => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const userItem = localStorage.getItem('user');
    const user = JSON.parse(userItem);
    setUser(user);
  }, []);


  const tempList = [];
  if (user?.adminFlag) {
    tempList.push({
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dash-panel'
    });
  }

  tempList.push(
    {
      title: 'File Upload',
      icon: Upload,
      path: '/file-upload'
    },
    {
      title: 'Download',
      icon: DownloadOutline,
      path: '/download-file'
    },
  );

  return tempList;

  // return [
  //   {
  //     sectionTitle: 'Start'
  //   },
  //   // {
  //   //   title: 'Dashboard',
  //   //   icon: HomeOutline,
  //   //   path: '/'
  //   // },
  //   {
  //     title: 'Dashboard',
  //     icon: HomeOutline,
  //     path: '/dash-panel'
  //   },
  //   {
  //     title: 'File Upload',
  //     icon: Upload,
  //     path: '/file-upload'
  //   },
  //   {
  //     title: 'Download',
  //     icon: DownloadOutline,
  //     path: '/download-file'
  //   },
  //   // {
  //   //   title: 'Account Settings',
  //   //   icon: AccountCogOutline,
  //   //   path: '/account-settings'
  //   // },
  //   // {
  //   //   sectionTitle: 'Pages'
  //   // },
  //   // {
  //   //   title: 'Login',
  //   //   icon: Login,
  //   //   path: '/pages/login',
  //   //   openInNewTab: true
  //   // },
  //   // {
  //   //   title: 'Register',
  //   //   icon: AccountPlusOutline,
  //   //   path: '/pages/register',
  //   //   openInNewTab: true
  //   // },
  //   // {
  //   //   title: 'Error',
  //   //   icon: AlertCircleOutline,
  //   //   path: '/pages/error',
  //   //   openInNewTab: true
  //   // },
  //   // {
  //   //   sectionTitle: 'User Interface'
  //   // },
  //   // {
  //   //   title: 'Typography',
  //   //   icon: FormatLetterCase,
  //   //   path: '/typography'
  //   // },
  //   // {
  //   //   title: 'Icons',
  //   //   path: '/icons',
  //   //   icon: GoogleCirclesExtended
  //   // },
  //   // {
  //   //   title: 'Cards',
  //   //   icon: CreditCardOutline,
  //   //   path: '/cards'
  //   // },
  //   // {
  //   //   title: 'Tables',
  //   //   icon: Table,
  //   //   path: '/tables'
  //   // },
  //   // {
  //   //   icon: CubeOutline,
  //   //   title: 'Form Layouts',
  //   //   path: '/form-layouts'
  //   // }
  // ]
}

export default navigation
