import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

var basePath = '/api/backend'

export const login = (data) => fetch(basePath + '/base/login', data, 'POST')
export const check = (data) => fetch(basePath + '/base/check', data, 'POST')
export const modify = (data) => fetch(basePath + '/base/modify', data, 'POST')
export const getGameRoundInfo = (data) => fetch(basePath + '/base/getGameRoundInfo', data, 'POST')
export const addGameRound = (data) => fetch(basePath + '/base/addGameRound', data, 'POST')
export const modifyGameRound = (data) => fetch(basePath + '/base/modifyGameRound', data, 'POST')
export const removeGameRound = (data) => fetch(basePath + '/base/removeGameRound', data, 'POST')
export const getWxMpUsers = (data) => fetch(basePath + '/base/getWxMpUsers', data, 'POST')

export const entry = (number, data) => fetch(basePath + '/ztoupiao/' + number + '/entry', data, 'GET')

export const getAuthorize = (data) => fetch('/api/wxopen/auth', data, 'POST')
