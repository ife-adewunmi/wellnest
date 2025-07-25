// src/components/Avatar.tsx

import React, { FunctionComponent, useState } from 'react'
import Image from 'next/image'

type AvatarProps = {
  size?: number
  source?: string
  type?: 'user' | 'group'
  profilePicture?: string
  headerImage?: string
  customDefault?: 'thumbnail'
  onClick?: () => void
}

const Avatar: FunctionComponent<AvatarProps> = ({
  source,
  type = 'user',
  size = 38,
  profilePicture,
  headerImage,
  customDefault,
  onClick
}) => {
  const [imageError, setImageError] = useState(false)

  const styles = {
    image: {
      width: size,
      height: size,
      borderRadius: size / 2,
      objectFit: 'cover' as const,
      display: 'block',
    },
    svgContainer: {
      width: size,
      height: size,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }

  const getImageSrc = () => {
    if (imageError) return null
    return headerImage || source || profilePicture || null
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const imageSrc = getImageSrc()

  if (customDefault === 'thumbnail') {
    return (
      <div style={styles.svgContainer} onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
        <Image
          src="/images/header-default-profile.svg"
          alt="Default Profile"
          width={size}
          height={size}
        />
      </div>
    )
  }

  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt="Avatar"
        width={size}
        height={size}
        style={{...styles.image, cursor: onClick ? 'pointer' : 'default'}}
        onError={handleImageError}
        onClick={onClick}
      />
    )
  } else if (type === 'user') {
    return (
      <div style={styles.svgContainer} onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
        <Image src="/images/profile-img.png" alt="Default Profile" width={size} height={size} />
      </div>
    )
  }
}

export { Avatar }
export default Avatar
