import { ImageViewerProps } from '../types/types'

const ImageViewer = ({
  src,
  alt,
  className,
  key
}: ImageViewerProps) => {
  return (
    <img src={src} alt={alt} key={key} className={`${className}`}/>
  )
}

export default ImageViewer