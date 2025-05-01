
interface TextInputProps {
    value : string | number,
    setValue : (val : string | number | any) => void;
    className : string,
    type:string,
    placeholder:string
}

const TextInput = (props: TextInputProps) => {
    const { value, setValue, className,type,placeholder } = props;

    const setData = (e: any) => {
        setValue(e.target.value)
    }
    
    return (
        <input type={type} placeholder={placeholder} className={className} value={value} onChange={(e) => setData(e)}/>
    );
};

export default TextInput;
