
import { createSlice } from "@reduxjs/toolkit"

const initialState={
    currentUser:null,
    error:null,
    loading:false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
            state.error=null;
        } ,
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        signoutSuccess:(state)=>{
            state.currentUser=null;
            state.error=null;
            state.loading=false;
        },
        updateStart:(state)=>{
            state.error=null,
            state.loading=true
        },
        updateSuccess:(state,action)=>{
            state.currentUser =action.payload,
            state.loading=false;
            state.error=null;
        },
        updateFailure:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        },
        deleteUserStart:(state)=>{
             state.loading=true;
             state.error=null;
        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },deleteUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        }

    }
});

export const {signInStart,signInFailure,signInSuccess,signoutSuccess,updateStart,updateFailure,updateSuccess,deleteUserFailure,deleteUserSuccess,deleteUserStart} =userSlice.actions;
export default userSlice.reducer;