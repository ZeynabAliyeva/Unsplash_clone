import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/slices/users';
import './index.css';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useQuery } from 'react-query';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 620,
	bgcolor: 'background.paper',
	border: '1px solid gray',
	borderRadius: '10px',
	boxShadow: 2,
	p: 4,
};

function AdminFeatures() {
	const [open, setOpen] = useState(false);
	const [updated, setUpdated] = useState({ name: '', email: '' });
	const [searchName, setSearchName] = useState('');
	const dispatch = useDispatch();
	const { users } = useSelector((state) => state.users);
	let ref = useRef(null);

	useEffect(() => {
		dispatch(fetchUsers());
	}, []);

	const isUsersLoading = users.status === 'loading';

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const { data, isLoading } = useQuery(
		'users',
		() => {
			return axios.get('http://localhost:8080/users/').then((res) => res.data);
		},
		{
			refetchInterval: 5000,
		}
	);

	const handleDelete = (item) => {
		axios.delete('http://localhost:8080/users/' + item);
	};

	const handleUpdate = () => {
		axios
			.put('http://localhost:8080/users/' + updated._id, {
				fullName: updated.fullName,
				email: updated.email,
			})
			.then((res) => setOpen(false));
	};

	const handleClickUpdate = (data) => {
		setOpen((prev) => !prev);
		setUpdated(data);
		ref.current?.scrollIntoView({
			behavior: 'smooth',
		});
	};

	let filteredData = data;
	if (searchName) {
		filteredData = data.filter((item) => item.fullName.toLowerCase().includes(searchName.toLowerCase()));
	}

	if (isLoading) return <h1>loading ...</h1>;

	return (
		<div className="adminPageWrapper">
			<form className="adminSrcForm">
				<input value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="search by name" />
			</form>
			<table className="w3-table-all">
				<thead className="w3-light-grey">
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Update</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{isUsersLoading ? (
						<p>loading</p>
					) : (
						filteredData?.map((data) => (
							<tr key={data._id}>
								<td>{data?.fullName}</td>
								<td>{data?.email}</td>
								<td>
									<button className="updateBtn" onClick={() => handleClickUpdate(data)}>
										Update
									</button>
									<Modal
										open={open}
										onClose={handleClose}
										aria-labelledby="modal-modal-title"
										aria-describedby="modal-modal-description"
									>
										<Box sx={style}>
											<div className="updateModalTitleBox">
												<h3>Add a new name and email</h3>
											</div>
											<form ref={ref} className="updateContainer">
												<input
													value={updated.fullName}
													type="text"
													onChange={(e) =>
														setUpdated((prevState) => {
															return {
																...prevState,
																fullName: e.target.value,
															};
														})
													}
													placeholder="enter new name"
												/>
												<input
													value={updated.email}
													onChange={(e) =>
														setUpdated((prevState) => {
															return {
																...prevState,
																email: e.target.value,
															};
														})
													}
													type="text"
													placeholder="enter new email"
												/>
												<button className="add" onClick={() => handleUpdate()}>
													Update
												</button>
											</form>
										</Box>
									</Modal>
								</td>
								<td>
									<button className="deleteBtn" onClick={() => handleDelete(data._id)}>
										Delete
									</button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

export default AdminFeatures;
