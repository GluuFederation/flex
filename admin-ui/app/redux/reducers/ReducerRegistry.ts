class ReducerRegistry {
  private _emitChange: ((reducers: { [key: string]: any }) => void) | null;
  private _reducers: { [key: string]: any };

  constructor() {
    this._emitChange = null;
    this._reducers = {};
  }
  
  getReducers(): { [key: string]: any } {
    return { ...this._reducers }
  }
  
  register(name: string, reducer: any): void {
    this._reducers = { ...this._reducers, [name]: reducer }
    if (this._emitChange) {
      this._emitChange(this.getReducers())
    }
  }
  
  setChangeListener(listener: (reducers: { [key: string]: any }) => void): void {
    this._emitChange = listener
  }
}
  
const reducerRegistry = new ReducerRegistry()
export default reducerRegistry