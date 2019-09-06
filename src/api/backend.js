import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

var basePath = '/api/backend'

export const login = (data) => fetch('/api/sessions', data, 'POST')
export const getUserInfo = (data) => fetch(basePath + '/users/show', data)
export const getGameRounds = (data) => fetch(basePath + '/game_rounds', data)
export const getGameRound = (id, data) => fetch(basePath + '/game_rounds/' + id, data)

export const getVoteStyle = (id, data) => fetch(basePath + '/game_rounds/getVoteStyle/' + id, data, 'GET')
export const setVoteStyle = (data) => fetch(basePath + '/game_rounds/setVoteStyle', data, 'POST')

export const searchPhotos = (data) => fetch(basePath + '/photos/search', data, 'POST')
export const removePhoto = (data) => fetch(basePath + '/photos/removePhoto', data, 'DELETE')
export const updateGameRound = (id, data) => fetch(basePath + '/game_rounds/' + id, data, 'PUT')

export const createAlbum = (data) => fetch(basePath + '/albums/createAlbum', data, 'POST')
export const getAlbums = (data) => fetch(basePath + '/albums/getAlbums', data, 'POST')
export const removeAlbum = (data) => fetch(basePath + '/albums/removeAlbum', data, 'DELETE')

export const addGameRound = (data) => fetch(basePath + '/game_rounds/addGameRound', data, 'POST')
export const modifyGameRound = (data) => fetch(basePath + '/game_rounds/modifyGameRound', data, 'PUT')
export const removeSlide = (data) => fetch(basePath + '/slides/removeSlide', data, 'DELETE')
export const modifyDesc = (data) => fetch(basePath + '/game_rounds/modifyDesc', data, 'POST')
export const removeGameRound = (data) => fetch(basePath + '/game_rounds/removeGameRound', data, 'DELETE')
export const getWxMpUsers = (data) => fetch(basePath + '/users/getWxMpUsers', data, 'GET')
export const bindPhotoRelationship = (data) => fetch(basePath + '/photos/bindPhotoRelationship', data, 'POST')

export const clearData = (data) => fetch(basePath + '/game_rounds/clearData', data, 'DELETE')

export const entry = (number, data) => fetch(basePath + '/ztoupiao/' + number + '/entry', data, 'GET')

export const getAuthorize = (data) => fetch('/api/backend/wxopen/getAuthUrl', data, 'GET')

export const getPosts = (data) => fetch(basePath + '/posts', data)
export const getPostDetail = (id, data) => fetch(basePath + '/posts/' + id, data)
export const addPost = (data) => fetch(basePath + '/posts/addPost', data, 'POST')
export const modifyPost = (data) => fetch(basePath + '/posts/modifyPost', data, 'PUT')
export const removePost = (data) => fetch(basePath + '/posts/removePost', data, 'DELETE')
export const removeCover = (data) => fetch(basePath + '/covers/removeCover', data, 'DELETE')

export const getTermInfo = (data) => fetch(basePath + '/terms/getTermInfo', data, 'GET')
export const addTerm = (data) => fetch(basePath + '/terms/addTerm', data, 'POST')
export const modifyTerm = (data) => fetch(basePath + '/terms/modifyTerm', data, 'PUT')
export const removeTerm = (data) => fetch(basePath + '/terms/removeTerm', data, 'DELETE')
export const getTermDetail = (data) => fetch(basePath + '/terms/getTermDetail', data, 'GET')
