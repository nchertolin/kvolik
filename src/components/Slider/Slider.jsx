import React, { useEffect, useRef, useState } from 'react';
import styles from './Slider.module.scss';
import { v4 } from 'uuid';
export default function Slider({ pictures }) {
  const [currentPic, setCurrentPic] = useState(0);
  const pictureRef = useRef();

  useEffect(() => {
    setTimeout(showPicture, 4000);
  });

  function showPicture() {
    if (currentPic < pictures.length - 1) {
      setCurrentPic(currentPic + 1);
    } else {
      setCurrentPic(0);
    }
  }

  return (
    <div className={styles.wrapper}>
      <img ref={pictureRef} src={pictures[currentPic]} alt="картинка" />
      <ul className={styles.dots}>
        {pictures.map((element, index) => <li key={v4()}><span className={index === currentPic ? styles.active : ''}></span></li>)}
      </ul>
    </div>
  )
}
