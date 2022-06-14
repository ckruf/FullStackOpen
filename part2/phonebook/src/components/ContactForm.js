import Input from "./Input"

const ContactForm = ({onSubmit, nameInputValue, nameInputOnChange,
    numberInputValue, numberInputOnChange}) => (
    <form onSubmit={onSubmit} >
        <div>
            name: <Input value={nameInputValue} onChangeHandler={nameInputOnChange} />
        </div>
        <div>
            number: <Input value={numberInputValue} onChangeHandler={numberInputOnChange} />
        </div>
        <div>
            <button type="submit">add</button>
        </div>
    </form>
)


export default ContactForm;