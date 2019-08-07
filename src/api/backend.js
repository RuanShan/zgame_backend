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
export const modifyGameRound = (data) => fetch(basePath + '/base/modifyGameRound', data, 'POST')
export const modifyDesc = (data) => fetch(basePath + '/base/modifyDesc', data, 'POST')
export const removeGameRound = (data) => fetch(basePath + '/base/removeGameRound', data, 'POST')
export const getWxMpUsers = (data) => fetch(basePath + '/base/getWxMpUsers', data, 'POST')

export const entry = (number, data) => fetch(basePath + '/ztoupiao/' + number + '/entry', data, 'GET')

export const getAuthorize = (data) => fetch('/api/wxopen/auth', data, 'POST')

export const getPosts = (data) => fetch(basePath + '/posts', data)
export const getPostDetail = (id, data) => fetch(basePath + '/posts/' + id, data)
export const addPost = (data) => fetch(basePath + '/base/addPost', data, 'POST')
export const modifyPost = (data) => fetch(basePath + '/base/modifyPost', data, 'POST')
export const removePost = (data) => fetch(basePath + '/base/removePost', data, 'POST')
export const removeCover = (data) => fetch(basePath + '/base/removeCover', data, 'POST')

export const getTermInfo = (data) => fetch(basePath + '/base/getTermInfo', data, 'POST')
export const addTerm = (data) => fetch(basePath + '/base/addTerm', data, 'POST')
export const modifyTerm = (data) => fetch(basePath + '/base/modifyTerm', data, 'POST')
export const removeTerm = (data) => fetch(basePath + '/base/removeTerm', data, 'POST')
export const getTermDetail = (data) => fetch(basePath + '/base/getTermDetail', data, 'POST')
