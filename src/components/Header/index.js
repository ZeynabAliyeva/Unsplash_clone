import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import unsplashicon from '../../assets/icons/unsplash.svg';

import logOutIcon from '../../assets/icons/logout.png';
import './index.css';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddButton from './AddButton';
import avatar from '../../assets/images/avatarUser.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth, selectIsAuthMe } from '../../redux/slices/auth';

function Header() {
	let activeStyle = {
		textDecoration: 'underline',
	};
	let menuRef = useRef();
	const [open, setOpen] = useState(false);
	const isAuth = useSelector(selectIsAuth);
	const userData = useSelector(selectIsAuthMe);
	const dispatch = useDispatch();

	useEffect(() => {
		let handler = (e) => {
			if (!menuRef.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
	}, []);

	const onClickLogOut = () => {
		dispatch(logout());
		window.localStorage.removeItem('token');
		window.localStorage.removeItem('id');
	};

	return (
		<div className="headerWrapper">
			<div className="headerLeft">
				<NavLink to="/">
					<div className="unsplash_info_box">
						<img className="unsplash_icon" src={unsplashicon} alt="#" />
						<div className="unsplash_title_box">
							<h3>My Unsplash</h3>
							<p>
								<span>devchallenges.io</span>
							</p>
						</div>
					</div>
				</NavLink>
			</div>
			<div className="headerRight">
				<div className="header_btn_box">{isAuth && <AddButton className="addPhotoModal" />}</div>
				<div className="user_info">
					{isAuth ? (
						<NavLink to="/profil">
							<img
								src={userData.avatar ? `http://localhost:8080${userData.avatar}` : avatar}
								alt="#"
								className="user_infoTitle"
							/>
						</NavLink>
					) : (
						<div>
							<NavLink to="/login">Log in</NavLink>
							<NavLink to="/sing-up">Sing Up</NavLink>
						</div>
					)}
				</div>
				{isAuth && (
					<Box ref={menuRef} className="hamburgerMenu">
						<IconButton onClick={(e) => setOpen(!open)} size="sm" edge="start" color="inherit" aria-label="menu">
							<MenuIcon sx={{ fontSize: '2.2rem' }} />
						</IconButton>
						{open && (
							<nav className="navBar">
								<ul>
									<li className="navLi">
										<NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
											Home
										</NavLink>
									</li>
									<li className="navLi">
										<NavLink to="/profil">
											{({ isActive }) => <span style={isActive ? activeStyle : undefined}>Profil</span>}
										</NavLink>
									</li>
									{userData._id === '6408a5868abed8bf8e468184' ? (
										<li className="navLi">
											<NavLink to="/admin">
												{({ isActive }) => <span style={isActive ? activeStyle : undefined}>Admin</span>}
											</NavLink>
										</li>
									) : null}
									<li className="navLi">
										<div className="logOutBox">
											<NavLink to="/">
												<button onClick={onClickLogOut}>Logout</button>
											</NavLink>
										</div>
									</li>
								</ul>
							</nav>
						)}
					</Box>
				)}
			</div>
		</div>
	);
}
export default Header;
