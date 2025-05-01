export const setValue = async(key: string, data: any) => {
    let finalData = await JSON.stringify(data);
    localStorage.setItem(key,finalData)
}

export const getValue = async(key:string) => {
    let data:any = await localStorage.getItem(key);
    return JSON.parse(data)
} 