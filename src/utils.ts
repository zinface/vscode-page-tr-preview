export function GetDate() {
    let date = new Date()
    
    return date.getFullYear()
    +"-"
    +(Number(date.getMonth())+1).toString()
    +"-"
    +date.getDate()
    +" "
    +date.getHours()
    +":"
    +date.getMinutes()
    +":"
    +date.getSeconds()
}