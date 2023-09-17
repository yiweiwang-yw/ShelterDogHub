import {
    Typography,
    Select,
    MenuItem
} from "@mui/material";

type AgeSelectorProps = {
    age: number | undefined;
    setAge: React.Dispatch<React.SetStateAction<number | undefined>>;
    label: string;
};

const AgeSelector: React.FC<AgeSelectorProps> = ({ age, setAge, label }) => (
    <>
        <Typography variant="subtitle1">{label}:</Typography>
        <Select
            value={age ? age : ""}
            onChange={(e) => setAge(Number(e.target.value))}
            style={{ minWidth: "100px", marginRight: "10px" }}
        >
            <MenuItem value="">Any</MenuItem>
            {Array.from({ length: 21 }).map((_, index) => (
                <MenuItem key={index} value={index}>
                    {index} {index === 1 ? "Year" : "Years"}
                </MenuItem>
            ))}
        </Select>
    </>
);

export default AgeSelector;