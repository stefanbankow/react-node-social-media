import * as actionTypes from "../actions/actionTypes";

const initialState = {
  drafts: null,
  isLoading: false,
  closeForm: false,
  errors: {},
};

const draftsReducer = (state = initialState, action) => {
  switch (action.type) {
    //Utils
    case actionTypes.DRAFT_REQUEST_INIT:
      return {
        ...state,
        errors: {},
        isLoading: true,
      };
    case actionTypes.CLOSE_DRAFT_FORM_RESET:
      return {
        ...state,
        closeForm: false,
      };
    //Getting
    case actionTypes.GET_DRAFTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        drafts: [...action.drafts],
      };
    case actionTypes.GET_DRAFTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
      };
    //Creating
    case actionTypes.CREATE_DRAFT_SUCCESS:
      if (state.drafts) {
        return {
          ...state,
          drafts: [action.draft, ...state.drafts],
          isLoading: false,
          closeForm: true,
        };
      } else {
        return {
          ...state,
          isLoading: false,
          closeForm: true,
        };
      }

    case actionTypes.CREATE_DRAFT_FAILURE:
      return {
        ...state,
        errors: { ...action.errors },
        isLoading: false,
      };
    //Updating
    case actionTypes.UPDATE_DRAFT_SUCCESS:
      let newDrafts = [...state.drafts];
      newDrafts = newDrafts.map((draft) =>
        draft._id === action.updatedDraft._id ? action.updatedDraft : draft
      );
      return {
        ...state,
        isLoading: false,
        closeForm: true,
        drafts: newDrafts,
      };
    case actionTypes.UPDATE_DRAFT_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
      };
    //Publishing
    case actionTypes.PUBLISH_DRAFT_SUCCESS:
      let updatedDrafts = [...state.drafts];
      updatedDrafts = updatedDrafts.filter(
        (draft) => draft._id !== action.updatedDraftId
      );
      return {
        ...state,
        isLoading: false,
        drafts: updatedDrafts,
      };
    case actionTypes.PUBLISH_DRAFT_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
      };
    //Deleting
    case actionTypes.DELETE_DRAFT_SUCCESS:
      let draftsCopy = [...state.drafts];
      draftsCopy = draftsCopy.filter(
        (draft) => draft._id !== action.deletedDraftId
      );
      return {
        ...state,
        isLoading: false,
        drafts: draftsCopy,
      };
    case actionTypes.DELETE_DRAFT_FAILURE:
      return {
        ...state,
        isLoading: false,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export default draftsReducer;
