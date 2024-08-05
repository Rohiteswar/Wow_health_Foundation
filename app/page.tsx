'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import styles from './Donationpage.module.css';
import loadRazorpayScript from './loadRazorPayScript'; // Adjust the path as necessary
import ThankYouModal from './Components/Thank_you_model/ThankYouModal'; // Adjust the path as necessary

interface FormData {
  name: string;
  phone: string;
  amount: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  amount?: string;
}

const DonationPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    amount: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = (): FormErrors => {
    let formErrors: FormErrors = {};
    if (!formData.name) formErrors.name = 'Name is required';
    if (!formData.phone) formErrors.phone = 'Phone number is required';
    if (!formData.amount) {
      formErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) < 129) {
      formErrors.amount = 'Please donate more than 129 rupees';
    }
    return formErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        await loadRazorpayScript();
        openRazorpayCheckout();
      } catch (error) {
        console.error('Failed to load Razorpay script:', error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const openRazorpayCheckout = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY, // Use the environment variable
      amount: parseFloat(formData.amount) * 100, // Convert amount to paisa
      currency: 'INR',
      name: 'Donation',
      description: 'Thank you for your generous donation',
      handler: function (response: any) {
        console.log('Payment successful', response);
        setIsSubmitted(true);
        setIsModalOpen(true);
        setFormData({
          name: '',
          phone: '',
          amount: '',
        });
      },
      prefill: {
        name: formData.name,
        contact: formData.phone,
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const quote = "''We can't help everyone but everyone can help someone''";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Image 
            src="/wowhealthlogo.jpg" 
            alt="Company Logo" 
            width={150} 
            height={50}
            className={styles.logo}
          />
        </div>
        <div className={styles.marqueeContainer}>
          <p className={styles.marquee}>
            Celebrate your birthday by giving back! Please join us and donate to make a difference.
          </p>
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <div className={styles.imageContainer}>
            <Image 
              src="/donation.jpg" 
              alt="Inspirational" 
              layout="fill" 
              objectFit="cover" 
            />
            <div className={styles.overlayText}>
              {quote}
            </div>
          </div>
        </div>
        <div className={styles.rightPanel}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>Make a Donation</h2>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              className={styles.input} 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
            
            <label htmlFor="phone" className={styles.label}>Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              className={styles.input} 
              value={formData.phone} 
              onChange={handleInputChange} 
              required 
            />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
            
           
            
            <label htmlFor="amount" className={styles.label}>Amount</label>
            <input 
              type="number" 
              id="amount" 
              name="amount" 
              className={styles.input} 
              value={formData.amount} 
              onChange={handleInputChange} 
              required 
              min="0" 
              step="0.01"
            />
            {errors.amount && <span className={styles.error}>{errors.amount}</span>}
            
            <button type="submit" className={styles.button}>Donate</button>
            {isSubmitted && <p className={styles.success}>Thank you for your donation!</p>}
          </form>
        </div>
      </div>
      <footer className={styles.footer}>
        <p className={styles.contactUs}>Contact us: <span className={styles.phoneNumber}>9985232345</span></p>
      </footer>
      <ThankYouModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </div>
  );
};

export default DonationPage;
