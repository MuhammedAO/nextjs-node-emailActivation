import React, { useState } from 'react'
import { useMutate } from 'restful-react'
import { PageTitle } from 'components/shared'

const Upload = () => {
  const [selectedImage, setselectedImage] = useState()
  const [images, setImages] = useState([])
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
        // console.log(uploadedImage)
        setImages([...images, uploadedImage])
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
      <div className="row text-center text-lg-left">
        {images.map(image => (
          <div className="col-md-3" key={image.cloudinaryId}>
            <a href={image.url} target="_blank" className="d-block mb-4 h-100">
              <img src={image.url} alt="vase" className="img-fluid img-thumbnail" />
            </a>
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}

export default Upload
