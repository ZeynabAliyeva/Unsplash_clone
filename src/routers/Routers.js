import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import Admin from '../pages/Admin';
import Detail from '../pages/Detail';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Profil from '../pages/Profile';
import Registration from '../pages/Registration';
import { fetchAuthMe } from '../redux/slices/auth';

function Routers() {
	const dispath = useDispatch();

	useEffect(() => {
		dispath(fetchAuthMe());
	});

	return (
		<>
			<Routes>
				<Route element={<PageLayout />}>
					<Route index element={<Home />} />
					<Route path="/detail/:id" element={<Detail />} />
					<Route path="/admin" element={<Admin />} />
					<Route path="/login" element={<Login />} />
					<Route path="/sing-up" element={<Registration />} />
					<Route path="/profil" element={<Profil />} />
				</Route>
			</Routes>
		</>
	);
}

export default Routers;
