import filmRepository from "../../data/repositories/filmRepository.js"
import filmMap from "../mappers/filmDbToServiceMap.js"

const getAll = async () => {
    const dbFilms = await filmRepository.getAll()

    return dbFilms.map(film => filmMap(film))
}

const get = async (id) => {
    const dbFilms = await filmRepository.get(id)
    const mappedFilms = dbFilms.map(film => filmMap(film))
    
    return mappedFilms.shift()
}

const getIdByTitle = async (title) => {
    const id = await filmRepository.getIdByTitle(title)

    return id
}

const filmService = {
    getAll,
    get,
    getIdByTitle
}

export default filmService