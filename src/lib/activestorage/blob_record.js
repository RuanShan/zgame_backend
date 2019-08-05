export class BlobRecord {
  constructor(file, checksum, url, uploadExtrData) {
    this.file = file
    this.uploadExtrData = uploadExtrData
    this.attributes = {
      file_name: file.name,
      content_type: file.type,
      file_size: file.size,
      checksum: checksum
    }

    this.xhr = new XMLHttpRequest()
    this.xhr.open('POST', url, true)
    this.xhr.responseType = 'json'
    this.xhr.setRequestHeader('Content-Type', 'application/json')
    this.xhr.setRequestHeader('Accept', 'application/json')
    this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    this.xhr.addEventListener('load', event => this.requestDidLoad(event))
    this.xhr.addEventListener('error', event => this.requestDidError(event))
  }

  get status() {
    return this.xhr.status
  }

  get response() {
    const { responseType, response } = this.xhr
    if (responseType === 'json') {
      return response
    } else {
      // Shim for IE 11: https://connect.microsoft.com/IE/feedback/details/794808
      return JSON.parse(response)
    }
  }

  create(callback) {
    this.callback = callback
    this.xhr.send(JSON.stringify({ number: this.uploadExtrData.number, photo: this.attributes ,type:this.uploadExtrData.type,id:this.uploadExtrData.id}))
  }

  requestDidLoad(event) {
    if (this.status >= 200 && this.status < 300) {
      const { response } = this
      const { directUploadData } = response
      delete response.directUploadData
      this.attributes = response
      this.directUploadData = directUploadData
      this.callback(null, this.toJSON())
    } else {
      this.requestDidError(event)
    }
  }

  requestDidError(event) {
    this.callback(`Error creating Blob for "${this.file.name}". Status: ${this.status}`)
  }

  toJSON() {
    const result = {}
    for (const key in this.attributes) {
      result[key] = this.attributes[key]
    }
    return result
  }
}
