import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import styles from './ThankYouModal.module.css';

interface ThankYouModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onRequestClose }) => {
  // useEffect(() => {
  //   if (typeof document !== 'undefined') {
  //     ReactModal.setAppElement('#__next');
  //   }
  // }, []);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h2>Your Donation is Done</h2>
      <p>Thanks for helping needful people.</p>
      <p>Moreover, celebrate your birthday with us!</p>
      <button onClick={onRequestClose} className={styles.closeButton}>Close</button>
    </ReactModal>
  );
};

export default ThankYouModal;
