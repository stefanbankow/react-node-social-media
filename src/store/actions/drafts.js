import * as actionTypes from "./actionTypes";
import axios from "axios";

export const draftRequestInit = () => {
  return {
    type: actionTypes.DRAFT_REQUEST_INIT,
  };
};

export const closeFormReset = () => {
  return {
    type: actionTypes.CLOSE_DRAFT_FORM_RESET,
  };
};
//Getting all drafts of user
export const getDraftsSuccess = (drafts) => {
  return {
    type: actionTypes.GET_DRAFTS_SUCCESS,
    drafts,
  };
};

export const getDraftsFailure = (errors) => {
  return {
    type: actionTypes.GET_DRAFTS_FAILURE,
    errors,
  };
};

export const getDraftsAsync = () => {
  return (dispatch) => {
    dispatch(draftRequestInit());
    axios
      .get("/posts/drafts")
      .then((res) => {
        dispatch(getDraftsSuccess(res.data.drafts));
      })
      .catch((err) => {
        console.error(err);
        dispatch(getDraftsFailure(err.response ? err.response.data : err));
      });
  };
};

//Creating drafts
export const createDraftSuccess = (draft) => {
  return {
    type: actionTypes.CREATE_DRAFT_SUCCESS,
    draft,
  };
};

export const createDraftFailure = (errors) => {
  return {
    type: actionTypes.CREATE_DRAFT_FAILURE,
    errors,
  };
};

export const createDraftAsync = (draftData) => {
  return (dispatch) => {
    dispatch(draftRequestInit());
    axios
      .post("/posts", { ...draftData, public: false })
      .then((res) => {
        dispatch(createDraftSuccess(res.data));
        dispatch(closeFormReset());
      })
      .catch((error) => {
        console.error(error);
        dispatch(
          createDraftFailure(
            error.response ? error.response.data.error.errors : error.message
          )
        );
      });
  };
};

//Updating drafts
export const updateDraftSuccess = (updatedDraft) => {
  return {
    type: actionTypes.UPDATE_DRAFT_SUCCESS,
    updatedDraft,
  };
};

export const updateDraftFailure = (errors) => {
  return {
    type: actionTypes.UPDATE_DRAFT_FAILURE,
    errors,
  };
};

export const updateDraftAsync = (draftId, reqBody) => {
  return (dispatch) => {
    dispatch(draftRequestInit());
    axios
      .patch(`/posts/${draftId}`, reqBody)
      .then((res) => {
        dispatch(updateDraftSuccess(res.data.updatedPost));
        dispatch(closeFormReset());
      })
      .catch((err) => {
        console.error(err);
        dispatch(updateDraftFailure(err.response ? err.response.data : err));
      });
  };
};

//Publishing drafts
export const publishDraftSuccess = (updatedDraftId) => {
  return {
    type: actionTypes.PUBLISH_DRAFT_SUCCESS,
    updatedDraftId,
  };
};

export const publishDraftFailure = (errors) => {
  return {
    type: actionTypes.PUBLISH_DRAFT_FAILURE,
    errors,
  };
};

export const publishDraftAsync = (draftId) => {
  return (dispatch) => {
    dispatch(draftRequestInit());
    axios
      .patch(`/posts/${draftId}`, { public: true })
      .then((res) => {
        dispatch(publishDraftSuccess(draftId));
      })
      .catch((err) => {
        console.error(err);
        dispatch(publishDraftFailure(err.response ? err.response.data : err));
      });
  };
};

//Deleting drafts
export const deleteDraftSuccess = (deletedDraftId) => {
  return {
    type: actionTypes.DELETE_DRAFT_SUCCESS,
    deletedDraftId,
  };
};

export const deleteDraftFailure = (errors) => {
  return {
    type: actionTypes.DELETE_DRAFT_FAILURE,
    errors,
  };
};

export const deleteDraftAsync = (draftId) => {
  return (dispatch) => {
    dispatch(draftRequestInit());
    axios
      .delete(`/posts/${draftId}`)
      .then((res) => {
        dispatch(deleteDraftSuccess(draftId));
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          deleteDraftFailure(err.response ? err.response.data : err.message)
        );
      });
  };
};
