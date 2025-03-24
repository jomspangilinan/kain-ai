import { useState } from 'react'

export default function ImageUpload() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  console.log(image)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload a picture of your meal:
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
      {preview && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <img
            src={preview}
            alt="Meal preview"
            className="w-full max-w-xs rounded shadow-md"
          />
        </div>
      )}
    </div>
  )
}
