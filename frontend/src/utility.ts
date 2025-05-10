export function getAxiosErrorData(err:any) {
    console.log(err?.response);
    return err?.response?.data || { message: 'Unknown Error' };
}