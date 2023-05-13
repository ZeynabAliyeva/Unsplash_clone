import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import './index.css';
import { useState } from 'react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../../axios';
import { fetchPosts } from '../../redux/slices/post';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 620,
	bgcolor: 'background.paper',
	border: '1px solid gray',
	borderRadius: '10px',
	boxShadow: 24,
	p: 4,
};

export default function AddButton() {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const inputRef = useRef(null);
	const dispatch = useDispatch();
	const handleOpen = () => setOpen(true);

	const handleClose = () => setOpen(false);

	const handleChangeFile = async (e) => {
		try {
			const formData = new FormData();
			const file = e.target.files[0];
			console.log(file);
			formData.append('image', file);
			const { data } = await axios.post('/upload', formData);
			setImageUrl(data.url);
		} catch (err) {
			console.warn(err);
			alert('image is not send');
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const user = localStorage.getItem('id');
		try {
			const fields = {
				user,
				text,
				imageUrl,
			};
			const { data } = await axios.post('/posts', fields);
			dispatch(fetchPosts(data));
			setText('');
			setImageUrl('');
			setOpen(false);
		} catch (err) {
			console.warn(err);
			alert('post is not create');
		}
	};

	return (
		<div>
			<button className="addPhotoBtn" onClick={handleOpen}>
				Add a photo
			</button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<div className="modalTitleBox">
						<h3>Add a new photo</h3>
					</div>
					<form onSubmit={onSubmit} className="modalFormBox">
						<label>Label</label>
						<input placeholder="Suspendisse elit massa" value={text} onChange={(e) => setText(e.target.value)} />
						<input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
						<label>Photo URL</label>
						<input
							placeholder="Add new foto"
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							onClick={() => inputRef.current.click()}
						/>
						<div className="addModalBtn">
							<button className="addModalBtnCancel" onClick={handleClose}>
								Cancel
							</button>
							<button className="addModalBtnSubmit" type="submit">
								Submit
							</button>
						</div>
					</form>
				</Box>
			</Modal>
		</div>
	);
}
