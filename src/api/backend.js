import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

var basePath = '/api/backend'

export const login = (data) => fetch('/api/sessions', data, 'POST')
export const logout = (data) => fetch('/api/sessions', data, 'DELETE')
export const getUserInfo = (data) => fetch(basePath + '/users/show', data)
export const getGameRounds = (data) => fetch(basePath + '/game_rounds', data)
export const getGameRound = (id, data) => fetch(basePath + '/game_rounds/' + id, data)

export const getVoteStyle = (id, data) => fetch(basePath + '/game_rounds/' + id + '/getVoteStyle', data, 'GET')
export const setVoteStyle = (id, data) => fetch(basePath + '/game_rounds/' + id + '/setVoteStyle', data, 'POST')

export const searchPhotos = (data) => fetch(basePath + '/photos/search', data, 'POST')
export const removePhoto = (data) => fetch(basePath + '/photos/removePhoto', data, 'DELETE')
export const updateGameRound = (id, data) => fetch(basePath + '/game_rounds/' + id, data, 'PUT')

export const createAlbum = (data) => fetch(basePath + '/albums/createAlbum', data, 'POST')
export const getAlbums = (data) => fetch(basePath + '/albums/getAlbums', data, 'POST')
export const removeAlbum = (data) => fetch(basePath + '/albums/removeAlbum', data, 'DELETE')
export const modifyAlbum = (data) => fetch(basePath + '/albums/modifyAlbum', data, 'PUT')

export const createPost = (data) => fetch(basePath + '/game_rounds/createPost', data, 'POST')
export const editPost = (data) => fetch(basePath + '/game_rounds/modifyPost', data, 'POST')
export const deletePost = (data) => fetch(basePath + '/game_rounds/deletePost', data, 'POST')
export const getAllPost = (data) => fetch(basePath + '/game_rounds/getAllPost', data, 'POST')
export const getPostData = (data) => fetch(basePath + '/game_rounds/getPostDetail', data, 'POST')

export const createComment = (data) => fetch(basePath + '/comments/createComment', data, 'POST')
export const deleteComment = (data) => fetch(basePath + '/comments/deleteComment', data, 'POST')
export const getAllComment = (data) => fetch(basePath + '/comments/getAllComment', data, 'POST')
export const getCommentDetail = (data) => fetch(basePath + '/comments/getCommentDetail', data, 'POST')

export const addGameRound = (data) => fetch(basePath + '/game_rounds/addGameRound', data, 'POST')
export const modifyGameRound = (data) => fetch(basePath + '/game_rounds/modifyGameRound', data, 'PUT')
export const removeSlide = (data) => fetch(basePath + '/slides/removeSlide', data, 'DELETE')
export const modifyDesc = (data) => fetch(basePath + '/game_rounds/modifyDesc', data, 'POST')
export const removeGameRound = (data) => fetch(basePath + '/game_rounds/removeGameRound', data, 'DELETE')
export const getWxMpUsers = (data) => fetch(basePath + '/users/getWxMpUsers', data, 'GET')
export const removeWxMpUsers = (data) => fetch(basePath + '/users/removeWxMpUsers', data, 'DELETE')
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

export const getTermInfo = (data) => fetch(basePath + '/terms/getTermInfo', data, 'POST')
export const addTerm = (data) => fetch(basePath + '/terms/addTerm', data, 'POST')
export const modifyTerm = (data) => fetch(basePath + '/terms/modifyTerm', data, 'PUT')
export const removeTerm = (data) => fetch(basePath + '/terms/removeTerm', data, 'DELETE')
export const getTermDetail = (data) => fetch(basePath + '/terms/getTermDetail', data, 'GET')

export const getResultInfo = (data) => fetch(basePath + '/game_results/getResultInfo', data, 'POST')
export const getGameDayInfo = (data) => fetch(basePath + '/game_days/getGameDayInfo', data, 'POST')
export const getAlbumResultInfo = (data) => fetch(basePath + '/game_results/getAlbumResultInfo', data, 'POST')
export const getExportInfo = (data) => fetch(basePath + '/export/getExportInfo', data, 'POST')

export const createOtherGameRound = (data) => fetch(basePath + '/createOtherGameRound', data, 'POST')
export const getOtherGameRoundList = (data) => fetch(basePath + '/getOtherGameRoundList', data, 'POST')
export const getOtherGameRoundById = (data) => fetch(basePath + '/getOtherGameRoundById', data, 'POST')
export const updateOtherGameRound = (data) => fetch(basePath + '/updateGameRound', data, 'POST')
export const getGameType = (data) => fetch('/api/gametypes/getGameType', data, 'POST')
export const getGameTypeByType = (data) => fetch('/api/gametypes/getGameTypeByType', data, 'POST')
export const deleteOtherGameRound = (data) => fetch(basePath + '/deleteGameRound', data, 'POST')
export const clearOtherGameRound = (data) => fetch(basePath + '/clearGameRound', data, 'POST')

export const updateMenuData = (data) => fetch(basePath + '/updateMenuData', data, 'POST')
export const getMenuData = (data) => fetch(basePath + '/getMenuData', data, 'POST')

export const createGameAward = (data) => fetch(basePath + '/createGameAward', data, 'POST')
export const deleteGameAward = (data) => fetch(basePath + '/deleteGameAward', data, 'POST')
export const getGameAward = (data) => fetch(basePath + '/getGameAward', data, 'POST')

export const getGamePlayerList = (data) => fetch(basePath + '/getGamePlayerList', data, 'POST')
export const deleteGamePlayer = (data) => fetch(basePath + '/deleteGamePlayer', data, 'POST')

export const getRencentGameRoundList = (data) => fetch(basePath + '/getRencentGameRoundList', data, 'POST')
