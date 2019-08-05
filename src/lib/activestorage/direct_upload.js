import { FileChecksum } from './file_checksum'
import { BlobUpload } from './blob_upload'
import { BlobRecord } from './blob_record'

let id = 0

export class DirectUpload {
  // url: /gapi/photos/:code/create
  constructor(file, url, delegate, uploadExtrData) {
    this.id = ++id
    this.file = file
    this.url = url
    this.delegate = delegate
    this.uploadExtrData = uploadExtrData
  }

  create(callback) {
    FileChecksum.create(this.file, (error, checksum) => {
      if (error) {
        callback(error)
        return
      }
      const blob = new BlobRecord(this.file, checksum, this.url, this.uploadExtrData)

      // notify(this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr)

      blob.create(error => {
        if (error) {
          callback(error)
        } else {
          console.log('blob.create callback, blob = ', blob)
          const upload = new BlobUpload(this.file, blob.directUploadData)
          notify(this.delegate, 'directUploadWillStoreFileWithXHR', upload.xhr)
          upload.create(error => {
            if (error) {
              callback(error)
            } else {
              callback(null, blob.toJSON())
            }
          })
        }
      })
    })
  }
}

function notify(object, methodName, ...messages) {
  if (object && typeof object[methodName] === 'function') {
    return object[methodName](...messages)
  }
}
