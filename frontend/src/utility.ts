export function getAxiosErrorData(err:any) {
    return err?.response?.data || { message: 'Unknown Error' };
}