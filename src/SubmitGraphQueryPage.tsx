import { Button, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { postGraphQuery } from "./queryfunctions";

export default function SubmitGraphQueryPage() {

    const [queryStr, setQueryStr] = useState<string>('{"query":"{__typename}"}')

    const [queryObj, setQueryObj] = useState<object|null>({})

    const [myResult, setMyResult] = useState<object>({})

    const onQueryChange = (input:string) => {
        setQueryStr(input)

        try {const inputObj = JSON.parse(input); setQueryObj(inputObj)}
        catch {  setQueryObj(null) }
    }

    const postFn = useMutation({
        mutationFn: postGraphQuery,
        onSuccess: (result) => {setMyResult(result)},
        onError: () => {}
    })

    return (
        <Stack height="100%" padding="50px" spacing="10px">
        <TextField 
         sx={{width:"100%"}}
         id="queryinputbox"
         label="Query JSON"
         rows={12}
         value={queryStr}
         multiline
         onChange={e => onQueryChange(e.target.value)}>
        </TextField>

        <Button
        disabled={queryObj==null || postFn.isPending}
        variant="contained">
            POST QUERY
        </Button>
        <Stack><Typography variant="h3"><b>RESULT</b></Typography>
        <TextField 
        value={JSON.stringify(myResult)}>
        </TextField>
        </Stack>
        </Stack>
    )
}