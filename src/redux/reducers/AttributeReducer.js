import ReducerFactory from "./ReducerFactory";
const factory = new ReducerFactory("attributes", "attributes");
export const reducer = factory.reducer;
export const actions = factory.actions;
export default reducer;