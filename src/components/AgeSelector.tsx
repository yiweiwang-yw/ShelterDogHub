import { Typography, Select, MenuItem } from "@mui/material";

type AgeSelectorProps = {
    age: number | undefined;
    setAge: React.Dispatch<React.SetStateAction<number | undefined>>;
    label: string;
};

const AgeSelector: React.FC<AgeSelectorProps> = ({ age, setAge, label }) => (
    <>
        <Typography variant="subtitle1">{label}:</Typography>
        <Select
            value={age !== undefined ? age : ""}
            onChange={(e) =>
                setAge(
                    e.target.value === "" ? undefined : Number(e.target.value)
                )
            }
            style={{ minWidth: "100%", marginRight: "10px" }}
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
