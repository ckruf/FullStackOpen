const InputStateSetter = (setter) => (event) => setter(event.target.value);

export default InputStateSetter;