import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {Link, useNavigate} from 'react-router-dom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import './Header.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Liste des pages de navigation
const pages = [
    { name: 'Actualites', path: '/actualites' },
    { name: 'Calendrier-Resultats', path: '/calendrier-resultats' },
    { name: 'Classement', path: '/classement' },
    { name: 'Equipes', path: '/equipes' }
];

/**
 * Composant Header : affiche la barre de navigation
 * @author : https://mui.com/material-ui/react-app-bar/
 * @param connected
 * @returns {Element}
 * @constructor
 */
export default function Header({connected}) {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    let settings
    if (connected) {
        settings = [
            { name: 'Mon compte', path: '/account' },
            { name: 'Me deconnecter', path: '/logout' }
        ];
    } else {
        settings = [
            { name: 'Se connecter', path: '/login' },
            { name: 'S\'inscrire', path: '/register' }
        ]
    }

    // Fonctions pour ouvrir et fermer les menus
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    // Fonctions pour ouvrir et fermer les menus
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    // Fonctions pour fermer les menus
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    // Fonctions pour fermer les menus
    const handleCloseUserMenu = (path) => {
        navigate(path);
        closeSetting()
    };

    // Fonctions pour fermer les menus
    const closeSetting = () => {
        setAnchorElUser(null);
    }

    // Fonction pour gérer le clic sur un élément du menu
    const handleMenuItemClick = (path) => {
        navigate(path);
        handleCloseNavMenu();
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#ffffff', color: '#000000' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <SportsSoccerIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    </Link>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        FOOTBALL
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'centre' }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={() => handleMenuItemClick(page.path)}>
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <SportsSoccerIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}  />
                    </Link>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        FOOTBALL
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handleMenuItemClick(page.path)}
                                sx={{ my: 2, color: '#000000', backgroundColor: 'transparent' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <AccountCircleIcon sx={{ fontSize: '2.5rem' }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={closeSetting}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting.name} onClick={() => handleCloseUserMenu(setting.path)}>
                                    <Typography textAlign="center">{setting.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}