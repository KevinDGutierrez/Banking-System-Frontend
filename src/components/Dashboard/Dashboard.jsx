import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { logout as logoutHandler } from '../../shared/hooks/useLogout';
import { useMyAccount } from '../../shared/hooks/useDashboard';
import { useAccountBanking } from '../../shared/hooks/useDashboard';
import { useBanking } from '../../shared/hooks/useDashboard';
import { useClientesAdmin } from '../../shared/hooks/useDashboard';
import { useAdminAccounts } from '../../shared/hooks/useDashboard';
import Swal from 'sweetalert2';
import {
  AppBar,Toolbar,Typography,IconButton,Drawer,List,ListItem,ListItemIcon,ListItemText,Box,Divider,Button
} from '@mui/material';

const Dashboard = () => {
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { myAccount, handleMyAccount } = useMyAccount();
  const { accountBanking, handleAccountBanking } = useAccountBanking();
  const { banking, handleBanking } = useBanking();
  const { clientesAdmin, handleClientesAdmin } = useClientesAdmin();
  const { adminAccounts, handleAdminAccounts } = useAdminAccounts();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (location.state?.message) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }, [location.state]);
  const handleLogout = () => {
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión exitosamente.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      localStorage.clear()
      sessionStorage.clear()
      logoutHandler()
      navigate('/')
    })

  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const clientsSections = [
    { text: 'Cuenta Bancaria', icon: <AccountBalanceWalletIcon onClick={handleAccountBanking} />, onClick: handleAccountBanking },
    { text: 'Mi cuenta', icon: <AccountCircleIcon onClick={handleMyAccount} />, onClick: handleMyAccount },
    { text: 'Bancos', icon: <AccountBalanceOutlinedIcon onClick={handleBanking} />, onClick: handleBanking },
  ]
  const adminSections = [
    { text: 'Gestión de Clientes', icon: <ManageAccountsIcon onClick={handleClientesAdmin} />, onClick: handleClientesAdmin },
    { text: 'Gestión de Cuentas Bancarias', icon: <AssuredWorkloadIcon onClick={handleAdminAccounts} />, onClick: handleAdminAccounts },
  ]
  return (



    <Box className="overlay" sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Cerrar sesión
          </Button>
          <Button color="inherit" onClick={handleMyAccount} startIcon={<AccountCircleIcon />}>
            Mi cuenta
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
          <List>
            {(user?.role === 'ADMIN' ? adminSections : clientsSections).map((section, index) => (
              <ListItem
                key={index}
                button="true"
                onClick={section.onClick}
                component="div"
                sx={{ cursor: 'pointer' }}
              >
                <ListItemIcon>{section.icon}</ListItemIcon>
                <ListItemText primary={section.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Banking System
        </Typography>
        <Typography variant="body1">

        </Typography>
      </Box>
    </Box>
  );
}

export default Dashboard;