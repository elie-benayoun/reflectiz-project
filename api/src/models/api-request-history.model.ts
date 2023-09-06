export default interface IApiRequestHistory {
    id: number,
    method: string,
    path: string,
    query: string,
    body: string,
    origin: string,
}