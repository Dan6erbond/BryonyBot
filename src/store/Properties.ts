import { Property } from "../models/property";
import { typedAction } from "./actions";

export interface PropertiesState {
  properties: Property[];
}

const initialState: PropertiesState = {
  properties: [],
};

export const setProperties = (properties: Property[]) => {
  return typedAction("properties/SET", properties);
};

export const setProperty = (property: Property) => {
  return typedAction("properties/SET_PROPERTY", property);
};

type PropertiesAction = ReturnType<typeof setProperties | typeof setProperty>;

export function propertiesReducer(
  state = initialState,
  action: PropertiesAction
): PropertiesState {
  switch (action.type) {
    case "properties/SET":
      return {
        ...state,
        properties: action.payload,
      };
    case "properties/SET_PROPERTY":
      return {
        ...state,
        properties: state.properties.find(
          (p) => p.docRef?.id === action.payload.docRef?.id
        )
          ? state.properties.map((p) =>
              p.docRef?.id === action.payload.docRef?.id ? action.payload : p
            )
          : [...state.properties, action.payload],
      };
    default:
      return state;
  }
}
