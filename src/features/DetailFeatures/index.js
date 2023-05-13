import React, { useState, useEffect } from 'react';
import './index.css';
import ovnerAccount from '../../assets/images/avatarUser.png';
import userImg from '../../assets/images/avatarUser.png';
import heart from '../../assets/icons/heart-solid.svg';
import unlike from '../../assets/icons/unlike.svg';
import angleDown from '../../assets/icons/angle-down-solid.svg';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, selectIsAuth, selectIsAuthMe } from '../../redux/slices/auth';
import { commentsAdd, fetchPosts, saveLike } from '../../redux/slices/post';

function DetailFeatures() {
	const [detail, setDetail] = useState([]);
	const [getUser, setGetUser] = useState([]);
	const [openComment, SetOpenComment] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [Comments, setComments] = useState(detail.comments);
	const [commentwriting, setcommentwriting] = useState('');
	const dispatch = useDispatch();
	const userData = useSelector(selectIsAuthMe);
	const isAuth = useSelector(selectIsAuth);
	let deteilId = detail._id;

	useEffect(() => {
		dispatch(fetchPosts());
	}, [dispatch]);

	useEffect(() => {
		const liked = localStorage.getItem(`post-${deteilId}-isLiked`);
		setIsLiked(liked === 'true');
		dispatch(fetchPosts(liked));
		dispatch(fetchAuthMe(liked));
	}, []);

	const params = useParams();

	useEffect(() => {
		axios
			.get('/posts/' + params.id)
			.then((res) => {
				setDetail(res.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	useEffect(() => {
		if (detail.user) {
			axios
				.get('/users/' + detail.user)
				.then((res) => {
					setGetUser(res.data);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [detail]);

	const handleLikeClick = async () => {
		dispatch(saveLike({ postId: deteilId, userId: userData._id }))
			.then(() => {
				setIsLiked(!isLiked);
				localStorage.setItem(`post-${deteilId}-isLiked`, !isLiked);
			})
			.catch((error) => {
				console.error(error);
			});
		const { data } = await axios.get('/posts');
		dispatch(fetchPosts(data));
		dispatch(fetchAuthMe(data));
	};

	const addComment = async () => {
		const comment = {
			userId: `${userData._id}`,
			username: `${userData.fullName}`,
			postId: `${detail._id}`,
			comment: `${commentwriting}`,
			avatar: `${userData.avatar}`,
		};
		try {
			const response = await axios.put('/posts/comments/post', comment);
			dispatch(commentsAdd(response));
			setComments(Comments?.concat(response));
		} catch (error) {
			console.error(error);
		}
	};

	const handleAddComment = async (e) => {
		e.preventDefault();
		addComment();
		setcommentwriting('');
		const { data } = await axios.get('/posts');
		dispatch(fetchPosts(data));
		dispatch(fetchAuthMe(data));
	};

	return (
		<>
			{detail ? (
				<div className="detailContainer">
					<div className="detailHeader">
						<div className="imgOvner">
							<img src={getUser?.avatar ? `http://localhost:8080${getUser.avatar}` : ovnerAccount} alt="#" />
							<p>{getUser.fullName}</p>
						</div>
						{isAuth && (
							<div className="favIconBox">
								<button className="likeBtn" onClick={handleLikeClick}>
									<img src={isLiked ? heart : unlike} alt="#" />
								</button>
							</div>
						)}
					</div>
					<div className="detailImgCard">
						<img src={`http://localhost:8080${detail?.imageUrl}`} alt="#" />
					</div>
					<div className="detailInfoBox">
						<div className="imgAbout">
							<p>{detail?.createdAt?.replace(/^(\d{4})-(\d{2})-(\d{2})T.*/, '$1 $2 $3')}</p>
							<p>{detail.text}</p>
							<p>Like Quantity:{detail?.likes ? detail?.likes.length : 0}</p>
						</div>

						<div className="commantTitleBox">
							<button onClick={() => SetOpenComment((e) => !e)} className="likeBtn">
								Comments {detail?.comments?.length}
								<img className="arrowIcon" src={angleDown} alt="#" />
							</button>
						</div>
						{isAuth && (
							<form onSubmit={handleAddComment} className="commentForm">
								<img src={userData?.avatar ? `http://localhost:8080${userData.avatar}` : ovnerAccount} alt="#" />
								<input
									value={commentwriting}
									onChange={(e) => setcommentwriting(e.target.value)}
									placeholder="Add a comment"
								/>
								<button className="commentBtn" type="submit">
									add
								</button>
							</form>
						)}

						{openComment &&
							detail.comments?.map((comment) => (
								<div key={comment._id} className="commentsBox">
									<div className="commentRight">
										{!comment.avatar || comment.avatar === 'http://localhost:8080' || comment.avatar === 'undefined' ? (
											<img src={userImg} alt="#" />
										) : (
											<img src={`http://localhost:8080${comment.avatar}`} alt="#" />
										)}
									</div>
									<div className="commentLeft">
										<p>
											{comment.username}
											<span>{comment.comment}</span>
										</p>
										<div>
											<p>{comment.createdAt.replace(/^(\d{4})-(\d{2})-(\d{2})T.*/, '$1 $2 $3')}</p>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</>
	);
}

export default DetailFeatures;
