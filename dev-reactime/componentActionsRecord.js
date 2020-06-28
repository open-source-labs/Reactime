const componentActionsRecord = {};
const index = 0;

module.exports = {
  saveNew: (state, setterFunction) => {
    componentActionsRecord[index] = { state, setterFunction };
  },
};
