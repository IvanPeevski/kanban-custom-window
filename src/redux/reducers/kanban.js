import {KANBAN} from "../actions/types";

const initialState = {
   kanban: [],
};

const KanbanReducer = (state = initialState, action) => {
   switch (action.type) {
       case KANBAN:
           return {
               ...state,
               kanban: action.payload,
           };

       default:
           return state;
   }
};

export default KanbanReducer;