import { getBookEditionData, getBookWorksData, getSearchedBooks, getSearchedBooksPreview } from "../api/api";

const SET_INPUT_VALUE = 'SET-INPUT-VALUE';
const SET_FINDED_BOOKS = 'SET-FINDED-BOOKS';
const SET_FINDED_BOOKS_PREVIEW = 'SET-FINDED-BOOKS-PREVIEW'
const SET_MODAL_IS_OPEN = 'SET-MODAL-IS-OPEN';
const SET_BOOK_INFO = 'SET-BOOK-INFO';
const SET_TOTAL_BOOKS = 'SET-TOTAL-BOOKS';
const SET_CURRENT_PAGE = 'SET-CURRENT-PAGE';
const SET_IS_FETCHING = 'SET-IS-FETCHING';

const initialState = {
	inputValue: '',
	findedBooksPreview: null,
	findedBooks: null,
	bookInfo: null,
	modalIsOpen: false,
	booksOnPage: 100,
	totalBooks: '',
	currentPage: 1,
	isFetching: false,
};

export default function bookSearchReducer(state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case SET_IS_FETCHING:
		case SET_CURRENT_PAGE:
		case SET_TOTAL_BOOKS:
		case SET_BOOK_INFO:
		case SET_MODAL_IS_OPEN:
		case SET_FINDED_BOOKS_PREVIEW:
		case SET_FINDED_BOOKS:
		case SET_INPUT_VALUE:
			return { ...state, ...payload }
		default: return state;
	}
}

export const setInputValue = inputValue => ({
	type: SET_INPUT_VALUE,
	payload: { inputValue }
})
export const setFindedBooks = findedBooks => ({
	type: SET_FINDED_BOOKS,
	payload: { findedBooks }
})
export const setFindedBooksPreview = findedBooksPreview => ({
	type: SET_FINDED_BOOKS_PREVIEW,
	payload: { findedBooksPreview }
})
export const setIsModalOpen = modalIsOpen => ({
	type: SET_MODAL_IS_OPEN,
	payload: { modalIsOpen }
})
export const setBookInfo = bookInfo => ({
	type: SET_BOOK_INFO,
	payload: { bookInfo }
})
export const setTotalBooks = totalBooks => ({
	type: SET_TOTAL_BOOKS,
	payload: { totalBooks }
})
export const setCurrentPage = currentPage => ({
	type: SET_CURRENT_PAGE,
	payload: { currentPage }
})
export const setIsFetching = isFetching => ({
	type: SET_IS_FETCHING,
	payload: { isFetching }
})

export const getBooks = (value, pageNumber = 1) => async dispatch => {
	dispatch(setIsFetching(true));
	const response = await getSearchedBooks(value, pageNumber);
	const { docs, numFound } = response.data;

	console.log(response);

	dispatch(setFindedBooks(docs));
	dispatch(setTotalBooks(numFound));
	dispatch(setCurrentPage(pageNumber));
	dispatch(setIsFetching(false));
}

export const getBooksPreview = value => async dispatch => {
	dispatch(setIsFetching(true));
	const response = await getSearchedBooksPreview(value);
	const { docs } = response.data;
	dispatch(setFindedBooksPreview(docs));
	dispatch(setIsFetching(false));
}

export const getBookInfo = (worksKey, editionKey, info) => async dispatch => {
	dispatch(setIsFetching(true));
	const response = await Promise.all([
		getBookWorksData(worksKey),
		getBookEditionData(editionKey)
	]);

	let [
		{ description },
		{ isbn_10, isbn_13, publish_date, publishers }
	] = response.map(i => i.data);

	if (typeof description === 'object') description = description.value;

	dispatch(setBookInfo({
		description,
		isbn_10,
		isbn_13,
		publish_date,
		publishers,
		...info
	}));
	dispatch(setIsFetching(false));
}