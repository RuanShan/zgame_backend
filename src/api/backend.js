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

export const addGameRound = (data) => fetch(basePath + '/base/addGameRound', data, 'POST')
export const modifyGameRound = (data) => fetch(basePath + '/base/modifyGameRound', data, 'PUT')
export const removeSlide = (data) => fetch(basePath + '/base/removeSlide', data, 'POST')
export const modifyDesc = (data) => fetch(basePath + '/base/modifyDesc', data, 'PUT')
export const removeGameRound = (data) => fetch(basePath + '/base/removeGameRound', data, 'POST')
export const getWxMpUsers = (data) => fetch(basePath + '/base/getWxMpUsers', data, 'GET')

export const entry = (number, data) => fetch(basePath + '/ztoupiao/' + number + '/entry', data, 'GET')

export const getAuthorize = (data) => fetch('/api/wxopen/auth', data, 'GET')

export const getPostInfo = (data) => fetch(basePath + '/base/getPostInfo', data, 'GET')
export const addPost = (data) => fetch(basePath + '/base/addPost', data, 'POST')
export const modifyPost = (data) => fetch(basePath + '/base/modifyPost', data, 'PUT')
export const removePost = (data) => fetch(basePath + '/base/removePost', data, 'POST')
export const removeCover = (data) => fetch(basePath + '/base/removeCover', data, 'POST')
export const getPostDetail = (data) => fetch(basePath + '/base/getPostDetail', data, 'GET')

export const getTermInfo = (data) => fetch(basePath + '/base/getTermInfo', data, 'GET')
export const addTerm = (data) => fetch(basePath + '/base/addTerm', data, 'POST')
export const modifyTerm = (data) => fetch(basePath + '/base/modifyTerm', data, 'PUT')
export const removeTerm = (data) => fetch(basePath + '/base/removeTerm', data, 'POST')
export const getTermDetail = (data) => fetch(basePath + '/base/getTermDetail', data, 'GET')
