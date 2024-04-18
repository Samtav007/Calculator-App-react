import React, { useReducer } from "react";
import "./App.css";
import Button from "./Components/button";
import Operator from "./Components/functions";

export const ACTIONS = {
  ADD_DIGIT: "ADD_DIGIT",
  ADD_OPERATOR: "ADD_OPERATOR",
  EVAL: "EVAL",
  ALL_CLEAR: "ALL_CLEAR",
  DELETE: "DEL",
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overWrite || (action.payload.digit === "." && (state.currentOperand || "").includes("."))) {
        return { ...state, currentOperand: action.payload.digit, overWrite: false };
      }
      if (action.payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      return { ...state, currentOperand: `${state.currentOperand || ""}${action.payload.digit}` };

    case ACTIONS.ADD_OPERATOR:
      if (!state.currentOperand || (state.currentOperand === null && state.previousOperand === null)) {
        return state;
      }
      const newState = {
        ...state,
        previousOperand: state.currentOperand !== null ? state.currentOperand : state.previousOperand,
        currentOperand: null,
        operator: action.payload.operator
      };
      return state.previousOperand !== null ? { ...newState, previousOperand: answer(newState) } : newState;

    case ACTIONS.DELETE:
      if (!state.currentOperand || state.overWrite) {
        return { ...state, overWrite: false, currentOperand: null };
      }
      return { ...state, currentOperand: state.currentOperand.length === 1 ? null : state.currentOperand.slice(0, -1) };

    case ACTIONS.EVAL:
      if (!state.operator || state.currentOperand === null || state.previousOperand === null) {
        return state;
      }
      return {
        ...state,
        overWrite: true,
        previousOperand: null,
        operator: null,
        currentOperand: answer(state)
      };

    case ACTIONS.ALL_CLEAR:
      return { ...state, currentOperand: null, previousOperand: null, operator: null };

    default:
      return state;
  }
}

function formatOperand(operand) {
  if (!operand) return '';
  const [integer, decimal] = operand.split('.');
  return decimal ? `${parseInt(integer).toLocaleString()}.${decimal}` : parseInt(integer).toLocaleString();
}

function answer(state) {
  const { previousOperand, currentOperand, operator } = state;
  const [previous, current] = [parseFloat(previousOperand) || 0, parseFloat(currentOperand) || 0];
  switch (operator) {
    case '+':
      return (previous + current).toString();
    case '-':
      return (previous - current).toString();
    case '*':
      return (previous * current).toString();
    case '/':
      return (previous / current).toString();
    default:
      return '';
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, { previousOperand: null, currentOperand: null, operator: null, overWrite: false });

  return (
    <div className='container'>
      <div className='display'>
        <div>{formatOperand(state.previousOperand)} {state.operator}</div>
        <div>{formatOperand(state.currentOperand)}</div>
      </div>
      <div className='functioning-coontainer'>
        <div className='calculation'>
          <button className='action' onClick={() => dispatch({ type: ACTIONS.ALL_CLEAR })}>Clear All</button>
          <button className='items' onClick={() => dispatch({ type: ACTIONS.DELETE })}>Delete</button>
          <Operator operator="+" dispatch={dispatch} />
          <Button digit="1" dispatch={dispatch} />
          <Button digit="2" dispatch={dispatch} />
          <Button digit="3" dispatch={dispatch} />
          <Operator operator="-" dispatch={dispatch} />
          <Button digit="4" dispatch={dispatch} />
          <Button digit="5" dispatch={dispatch} />
          <Button digit="6" dispatch={dispatch} />
          <Operator operator="*" dispatch={dispatch} />
          <Button digit="7" dispatch={dispatch} />
          <Button digit="8" dispatch={dispatch} />
          <Button digit="9" dispatch={dispatch} />
          <Operator operator="/" dispatch={dispatch} />
          <Button digit="0" dispatch={dispatch} />
          <Button digit="." dispatch={dispatch} />
          <button className="number span_two" onClick={() => dispatch({ type: ACTIONS.EVAL })}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;
