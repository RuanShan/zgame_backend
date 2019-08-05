import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

var basePath = '/gapi/album'

export const createBeforeDirectUpload = (number, data) => fetch(basePath + '/' + number + '/getAlbumsInfo', data, 'POST')
export const modifyAlbum = (number, data) => fetch(basePath + '/' + number + '/modifyAlbum', data, 'POST')

export const createPoster = (number, data) => fetch(basePath + '/' + number + '/createPoster', data, 'POST')
export const getPoster = (number, data) => fetch(basePath + '/' + number + '/getPoster', data, 'POST')
export const modifyPoster = (number, data) => fetch(basePath + '/' + number + '/modifyPoster', data, 'POST')

export const createDesc = (number, data) => fetch(basePath + '/' + number + '/createDesc', data, 'POST')

export const createImage = (data) => fetch('/gapi/photos/ztoupiao/create', data, 'POST')
