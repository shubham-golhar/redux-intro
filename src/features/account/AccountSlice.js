import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const AccountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance = state.balance + action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance = state.balance - action.payload;
    },
    requestLoan: {
      //redux toolkit accept only one argument by default but in our case there are two arguments which is comming in the payload. so to accept that we need prepare function.

      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },

      reducer(state, action) {
        if (state.loan > 0) return;

        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance = action.payload.amount + state.balance;
      },
    },
    payLoan(state) {
      state.balance = state.balance - state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

console.log(AccountSlice);

export const { withdraw, requestLoan, payLoan } = AccountSlice.actions;

//when there is api call in that case we make seperate action creator for that like below and export it independantly
export function deposit(amount, currency) {
  if (currency === "USD")
    return { type: "account/deposit", payload: { amount, currency } };

  return async function (dispatch, getState) {
    //Api Call
    dispatch({ type: "account/convertingCurrency" });
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();

    //Return Action

    const converted = data.rates.USD;
    console.log("converted", converted);

    dispatch({ type: "account/deposit", payload: converted });
  };
}
export default AccountSlice.reducer;

// export default function accountReducer(state = initialStateAccount, action) {
//   switch (action.type) {
//     case "account/deposit":
//       console.log("reducer balance", state.balance + action.payload);
//       return {
//         ...state,
//         balance: state.balance + action.payload,
//         isLoading: false,
//       };

//     case "account/withdraw":
//       return { ...state, balance: state.balance - action.payload };

//     case "account/requestLoan":
//       if (state.loan > 0) return state;

//       return {
//         ...state,
//         loan: action.payload.amount,
//         loanPurpose: action.payload.purpose,
//         balance: action.payload.amount + state.balance,
//       };

//     case "account/payLoan":
//       return {
//         ...state,
//         loan: 0,
//         loanPurpose: "",
//         balance: state.balance - state.loan,
//       };

//     case "account/convertingCurrency":
//       return { ...state, isLoading: true };
//     default:
//       return state;
//   }
// }

// store.dispatch({ type: "account/deposit", payload: 500 });
// console.log("deposit", store.getState());
// store.dispatch({ type: "account/withdraw", payload: 300 });
// console.log("withdraw", store.getState());
// store.dispatch({
//   type: "account/requestLoan",
//   payload: { amount: 1000, purpose: "Buy a car" },
// });
// console.log("requestLoan", store.getState());
// store.dispatch({
//   type: "account/payLoan",
// });
// console.log("payLoan", store.getState());
// console.log(store.getState());

// Creating action creators for account
// export function deposit(amount, currency) {
//   if (currency === "USD")
//     return { type: "account/deposit", payload: { amount, currency } };

//   return async function (dispatch, getState) {
//     //Api Call
//     dispatch({ type: "account/convertingCurrency" });
//     const res = await fetch(
//       `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
//     );
//     const data = await res.json();

//     //Return Action

//     const converted = data.rates.USD;
//     console.log("converted", converted);

//     dispatch({ type: "account/deposit", payload: converted });
//   };
// }

// export function withdraw(amount) {
//   return { type: "account/withdraw", payload: amount };
// }

// export function requestLoan(amount, purpose) {
//   return {
//     type: "account/requestLoan",
//     payload: { amount, purpose },
//   };
// }

// export function payLoan() {
//   return { type: "account/payLoan" };
// }
//  store.dispatch(deposit(500));
// // console.log("deposit", store.getState());

// store.dispatch(withdraw(300));
// // console.log("withdraw", store.getState());

// store.dispatch(requestLoan(1000, "Buy a car"));
// // console.log("requestLoan", store.getState());

// store.dispatch(payLoan());
// // console.log("payLoan", store.getState());
