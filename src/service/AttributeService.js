class AttributeService {
    constructor(dispatch, actions, baseUrl) {
      this.dispatch = dispatch;
      this.actions = actions;
      this.baseUrl = baseUrl;
    }
    getAll = () => {
      this.dispatch(this.actions.requestGetItems());
      return fetch(this.baseUrl)
        .then(response => response.json())
        .then(json => this.dispatch(this.actions.requestGetItemsSuccess(json)));
    };
  }
  
  export default AttributeService;