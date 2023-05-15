import api from "../../utils/api";
import { KANBAN } from "./types";


export const kanban = () => async (dispatch) => {
    try{
        const res = await api.get(`/api/kanban`);
        dispatch({
            type: KANBAN,
            payload: res.data
        });
    } catch(err) {
        console.log(err);
    }
};
