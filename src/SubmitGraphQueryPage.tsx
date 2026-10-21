import { Button, Stack, TextField, Typography } from "@mui/material";
import { mutationOptions, useMutation } from "@tanstack/react-query";
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
        <Stack height="100%" padding="50px" spacing="10px"
        sx={{alignItems:"center"}}>
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
        sx = {{ bgcolor:"dark" }}
        // disabled={queryObj==null || postFn.isPending}
        variant="contained"

        onClick = { () => {
        if (queryObj != null) {
            postFn.mutate(queryObj)
        }
        }}
        >
            post query
        </Button>
        <Stack width="60%"
        ><Typography variant="h4">result</Typography>
        <TextField 
        value={JSON.stringify(myResult)}>
        </TextField>
        </Stack>
        </Stack>
    )
}