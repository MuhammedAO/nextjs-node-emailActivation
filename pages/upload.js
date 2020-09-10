import React, { useState } from 'react'
import { useMutate } from 'restful-react'
import { PageTitle } from 'components/shared'

const Upload = () => {
  const [selectedImage, setselectedImage] = useState()
  const { mutate: uploadImage } = useMutate({
    verb: "POST",
    path: "image-upload"
  })

  const handleChange = (e) => {
    setselectedImage(e.target.files[0])
  }

  const handleImageUpload = () => {
    if (!selectedImage) { return }
    //image needs to be sent to the server as a form data
    //packages(multer) for uploading files to server xpects them to be a form
    const formData = new FormData()
    formData.append('image', selectedImage)

    uploadImage(formData)
      .then(uploadedImage => {
        console.log(uploadedImage)
      })
      .catch(err => console.log(err))
  }
  return (
    <React.Fragment>
      <PageTitle text="Upload Image" />
      <input
        onChange={handleChange}
        accept=".jpg, .png, .jpeg"
        className="fileInput mb-2"
        type="file"
      />
      <div>
        <button
          onClick={handleImageUpload}
          disabled={!selectedImage}
          className="btn btn-primary mb-2">
          Upload
      </button>
      </div>
    </React.Fragment>
  )
}

export default Upload
