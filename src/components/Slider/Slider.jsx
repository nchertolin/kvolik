import React, { useEffect, useState } from 'react';
import styles from './Slider.module.scss';
import { v4 } from 'uuid';
export default function Slider({ pictures }) {
  const [currentPic, setCurrentPic] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      showPicture(1);
    }, 4000);
  });

  function showPicture(direction) {
    if (currentPic === 0 && direction < 0) {
      setCurrentPic(pictures.length - 1);
    } else {
      if (currentPic < pictures.length - 1) {
        setCurrentPic(currentPic + direction);
      } else {
        setCurrentPic(0);
      }
    }
  }

  return (
    <div className={styles.wrapper}>
      <img src={pictures[currentPic]} alt="" />
      <ul className={styles.dots}>
        {pictures.map((element, index) => <li key={v4()}><span className={index === currentPic ? styles.active : ''}></span></li>)}
      </ul>
    </div>
  )
}
