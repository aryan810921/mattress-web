import { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * --- LOCAL IMAGE IMPORT SYSTEM ---
 * Replace the files in src/assets/products/... to update your website images manually.
 * The system automatically supports multiple images per product.
 */

// Memory Foam
import memoryFoam1 from './assets/products/memory-foam/1.jpg';
import memoryFoam2 from './assets/products/memory-foam/2.jpg';
import memoryFoam3 from './assets/products/memory-foam/3.jpg';

// Bonded
import bonded1 from './assets/products/bonded/1.jpg';

// EP Foam
import epFoam1 from './assets/products/ep-foam/1.jpg';

// Pillows
import pillow1 from './assets/products/pillows/1.jpg';

// Combo Offers
import combo1 from './assets/products/combo-offers/1.jpg';

// Sections
import advisorImg from './assets/products/sleep-advisor/advisor.jpg';
import consultationImg from './assets/products/consultation/expert.jpg';
import heroImg from './assets/products/hero-bg.jpg';

const products = [
  { 
    id: 1, 
    name: 'EP + Foam Layer Mattress', 
    category: 'mattress', 
    description: 'Balanced medium-firm support with cushioning.',
    images: [epFoam1, memoryFoam1, memoryFoam2],
    comfort: 'Medium-Firm',
    bestFor: 'Back pain relief'
  },
  { 
    id: 2, 
    name: 'Bonded Mattress', 
    category: 'mattress', 
    description: 'Firm support and durable structure.',
    images: [bonded1, memoryFoam3],
    comfort: 'Firm/Hard',
    bestFor: 'Heavy usage and orthopedic support'
  },
  { 
    id: 3, 
    name: 'Memory Foam Layer Mattress', 
    category: 'mattress', 
    description: 'Better pressure relief and body contouring.',
    images: [memoryFoam1, memoryFoam2, memoryFoam3],
    comfort: 'Soft-Medium',
    bestFor: 'Shoulder/Hip/Joint pain relief'
  },
  { 
    id: 4, 
    name: 'Pure Foam Mattress', 
    category: 'mattress', 
    description: 'Ultra-soft and comfortable feel.',
    images: [memoryFoam2, epFoam1],
    comfort: 'Soft',
    bestFor: 'Cloud-like comfort seekers'
  },
  { 
    id: 5, 
    name: 'Pure EP Sheet Mattress', 
    category: 'mattress', 
    description: 'Affordable practical occasional-use option.',
    images: [epFoam1],
    comfort: 'Firm',
    bestFor: 'Guest rooms and temporary use'
  },
  { 
    id: 6, 
    name: '2-in-1 Sofa Cum Mattress', 
    category: 'mattress', 
    description: 'Space-saving dual-purpose design.',
    images: [memoryFoam1, bonded1],
    comfort: 'Medium',
    bestFor: 'Small rooms and foldable needs'
  },
  { 
    id: 7, 
    name: 'Memory Foam Pillow', 
    category: 'pillow', 
    description: 'Pressure-relieving support for head and neck.',
    images: [pillow1],
    comfort: 'Soft-Medium',
    bestFor: 'Neck pain and cervical discomfort'
  },
  { 
    id: 8, 
    name: 'Recron Fibre Pillow', 
    category: 'pillow', 
    description: 'Gentle support and hotel-like fluffy feel.',
    images: [pillow1],
    comfort: 'Soft',
    bestFor: 'Soft comfort and hotel-like feel'
  },
  { 
    id: 9, 
    name: 'Pure Foam Pillow', 
    category: 'pillow', 
    description: 'Firm and durable head support.',
    images: [pillow1],
    comfort: 'Firm',
    bestFor: 'Everyday use and budget-friendly needs'
  },
  { 
    id: 10, 
    name: 'Dewan Pillow', 
    category: 'pillow', 
    description: 'Traditional support for dewan and living spaces.',
    images: [pillow1],
    comfort: 'Medium',
    bestFor: 'Living rooms and dewan sets'
  },
  { 
    id: 11, 
    name: 'Hotel Soft Pillow', 
    category: 'pillow', 
    description: 'Extra plush pillow for that five-star hotel feel.',
    images: [pillow1],
    comfort: 'Ultra-Soft',
    bestFor: 'Luxury sleep experience'
  },
];

const combos = [
  {
    id: 1,
    name: 'Family Comfort Pack',
    description: 'EP + Foam Layer Mattress + 2 Recron Fibre Pillows',
    save: 'Save ₹999',
    images: [combo1, epFoam1],
    tag: 'Best Seller'
  },
  {
    id: 2,
    name: 'Luxury Sleep Pack',
    description: 'Memory Foam Mattress + 2 Memory Foam Pillows',
    save: 'Premium comfort combo',
    images: [combo1, memoryFoam1],
    tag: 'Premium'
  },
  {
    id: 3,
    name: 'Hostel Starter Pack',
    description: 'Bonded Mattress + 1 Pillow',
    save: 'Budget-friendly combo',
    images: [combo1, bonded1],
    tag: 'Budget'
  },
  {
    id: 4,
    name: 'Guest Room Combo',
    description: 'Foldable Mattress + 2 Pillows',
    save: 'Compact and affordable',
    images: [combo1, epFoam1],
    tag: 'Compact'
  }
];

const services = [
  { id: 1, title: 'Sofa Repair', icon: '🛋️' },
  { id: 2, title: 'Mattress Customization', icon: '📏' },
  { id: 3, title: 'Custom Mattress Making', icon: '🛏️' },
  { id: 4, title: 'Mattress Re-covering', icon: '🧵' },
  { id: 5, title: 'Foam Replacement', icon: '🔄' },
  { id: 6, title: 'Cushion Repair', icon: '✨' },
  { id: 7, title: 'Hostel / Hotel Bulk Orders', icon: '🏢' },
];

const WHATSAPP_NUMBER = "8109215398";
const WHATSAPP_LINK = `https://wa.me/91${WHATSAPP_NUMBER}`;
const INSTAGRAM_LINK = "https://www.instagram.com/dreamza___?igsh=MW9jOHdibHJjbGJjdw==";

/**
 * Reusable Product Card Component
 * Handles multiple images and thumbnail switching
 */
const ProductCard = ({ product, whatsappLink, isCombo = false }) => {
  const [activeImage, setActiveImage] = useState(product.images[0]);

  return (
    <div className={`product-card card ${isCombo ? 'combo-card' : ''}`}>
      <div className="p-img">
        <img src={activeImage} alt={product.name} />
        <div className={`p-tag ${isCombo ? 'combo-tag' : ''}`}>{isCombo ? product.tag : (product.category || product.comfort)}</div>
        
        {/* Thumbnail System */}
        {product.images.length > 1 && (
          <div className="p-thumbnails">
            {product.images.map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                className={activeImage === img ? 'active' : ''} 
                onClick={() => setActiveImage(img)}
                alt={`${product.name} thumbnail ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        {isCombo && <div className="combo-save">{product.save}</div>}
        <div className="p-actions">
          <a href={`${whatsappLink}?text=Hi, I want a quote for ${product.name}`} className="btn btn-primary btn-sm">
            {isCombo ? 'Inquiry Now' : 'Get Quote'}
          </a>
          <a href={whatsappLink} className="btn btn-whatsapp btn-sm">WhatsApp</a>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Lead Form State
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    selectedProduct: '',
    mattressSize: '',
    sleepIssue: '',
    budget: ''
  });

  // Recommendation State
  const [recStep, setRecStep] = useState(0); // 0: Start, 1-5: Questions, 6: Result
  const [recAnswers, setRecAnswers] = useState({});
  const [recommendedProduct, setRecommendedProduct] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [phoneError, setPhoneError] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setFormData({ ...formData, [name]: onlyNums });
        if (onlyNums.length === 10) setPhoneError(false);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length !== 10) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "dreamza_inquiries"), {
        ...formData,
        timestamp: serverTimestamp()
      });
      
      setFormSubmitted(true);
      // Reset form
      setFormData({
        fullName: '',
        phoneNumber: '',
        selectedProduct: '',
        mattressSize: '',
        sleepIssue: '',
        budget: ''
      });
      
      // Hide success message after delay
      setTimeout(() => {
        setFormSubmitted(false);
      }, 7000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startRecommendation = () => setRecStep(1);

  const handleRecAnswer = (key, value) => {
    const updated = { ...recAnswers, [key]: value };
    setRecAnswers(updated);
    if (recStep < 5) {
      setRecStep(recStep + 1);
    } else {
      findRecommendation(updated);
    }
  };

  const findRecommendation = (answers) => {
    let result = null;
    if (answers.type === 'Pillow') {
      if (answers.concern === 'Neck pain' || answers.concern === 'Cervical discomfort') {
        result = products.find(p => p.name === 'Memory Foam Pillow');
      } else if (answers.concern === 'Need soft comfort') {
        result = products.find(p => p.name === 'Recron Fibre Pillow');
      } else if (answers.concern === 'Need firm support' || answers.concern === 'Budget pillow') {
        result = products.find(p => p.name === 'Pure Foam Pillow');
      } else {
        result = products.find(p => p.name === 'Recron Fibre Pillow');
      }
    } else {
      // Mattress or Both
      if (answers.concern === 'Back pain') {
        result = products.find(p => p.name === 'EP + Foam Layer Mattress');
      } else if (['Shoulder pain', 'Hip/joint pain', 'Elderly comfort'].includes(answers.concern)) {
        result = products.find(p => p.name === 'Memory Foam Layer Mattress');
      } else if (['Need hard mattress', 'Budget-friendly option', 'Hostel/PG use'].includes(answers.concern)) {
        result = products.find(p => p.name === 'Bonded Mattress');
      } else if (answers.concern === 'Need soft comfort') {
        result = products.find(p => p.name === 'Pure Foam Mattress');
      } else if (['Guest/temporary use'].includes(answers.concern) || answers.usage === 'Temporary use' || answers.usage === 'Hotel/guest room') {
        result = products.find(p => p.name === 'Pure EP Sheet Mattress');
      } else if (answers.concern === 'Small room/foldable need') {
        result = products.find(p => p.name === '2-in-1 Sofa Cum Mattress');
      } else {
        // Fallback based on comfort pref
        if (answers.pref === 'Soft') result = products.find(p => p.name === 'Pure Foam Mattress');
        else if (answers.pref === 'Firm/Hard') result = products.find(p => p.name === 'Bonded Mattress');
        else result = products.find(p => p.name === 'EP + Foam Layer Mattress');
      }
    }
    setRecommendedProduct(result);
    setRecStep(6);
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo brand-font">DREAMZA</div>
          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#products" onClick={() => setMobileMenuOpen(false)}>Mattresses</a></li>
            <li><a href="#combos" onClick={() => setMobileMenuOpen(false)}>Combos</a></li>
            <li><a href="#pillows" onClick={() => setMobileMenuOpen(false)}>Pillows</a></li>
            <li><a href="#advisor" onClick={() => setMobileMenuOpen(false)}>Sleep Advisor</a></li>
            <li><a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a></li>
            <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Consultation</a></li>
          </ul>
          <div className="nav-btns">
            <a href={WHATSAPP_LINK} className="btn btn-whatsapp hide-mobile">WhatsApp</a>
            <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <div className="badge hero-badge">Premium Sleep Solutions</div>
            <h1 className="brand-font">Better Sleep Starts With <span className="text-primary">Dreamza</span></h1>
            <p>Customized mattresses and sleep solutions for comfort, pain relief, and better sleep. Handcrafted for your well-being.</p>
            <div className="hero-actions">
              <a href="#advisor" className="btn btn-primary">Find My Mattress</a>
              <a href="#products" className="btn btn-outline">View Products</a>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-main-image">
               {/* Hero Local Image */}
               <img src={heroImg} alt="Premium Bedroom" />
               <div className="floating-card card-1">
                  <span className="icon">🛡️</span>
                  <div>
                    <h4>Orthopedic Support</h4>
                    <p>Spinal alignment</p>
                  </div>
               </div>
               <div className="floating-card card-2">
                  <span className="icon">✨</span>
                  <div>
                    <h4>Premium Comfort</h4>
                    <p>Luxury materials</p>
                  </div>
               </div>
               <div className="floating-card card-3">
                  <span className="icon">📏</span>
                  <div>
                    <h4>Custom Sizes</h4>
                    <p>Perfectly fitted</p>
                  </div>
               </div>
               <div className="hero-blob"></div>
            </div>
          </div>
        </div>
        <div className="section-divider"></div>
      </header>

      {/* Products Section */}
      <section id="products" className="section-padding">
        <div className="container">
          <div className="section-title text-center">
            <div className="badge">Our Collection</div>
            <h2 className="brand-font">Premium Mattresses</h2>
            <p>Expertly crafted for your ultimate sleep experience.</p>
          </div>
          <div className="products-grid">
            {products.filter(p => p.category === 'mattress').map(p => (
              <ProductCard key={p.id} product={p} whatsappLink={WHATSAPP_LINK} />
            ))}
          </div>
        </div>
      </section>

      {/* Combo Offers Section */}
      <section id="combos" className="section-padding bg-cream">
        <div className="container">
          <div className="section-title text-center">
            <div className="badge">Limited Time</div>
            <h2 className="brand-font">Premium Combo Offers</h2>
            <p>Upgrade your bedroom with our curated comfort bundles.</p>
          </div>
          <div className="products-grid">
            {combos.map(c => (
              <ProductCard key={c.id} product={c} whatsappLink={WHATSAPP_LINK} isCombo={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Pillows Section */}
      <section id="pillows" className="section-padding">
        <div className="container">
          <div className="section-title text-center">
            <div className="badge">Pillow Collection</div>
            <h2 className="brand-font">Dreamza Pillow Collection</h2>
            <p>Discover the perfect support for your head and neck.</p>
          </div>
          <div className="products-grid">
            {products.filter(p => p.category === 'pillow').map(p => (
              <ProductCard key={p.id} product={p} whatsappLink={WHATSAPP_LINK} />
            ))}
          </div>
        </div>
      </section>

      {/* Dreamza Sleep Advisor Section */}
      <section id="advisor" className="section-padding advisor-section bg-cream">
        <div className="container advisor-container">
          <div className="advisor-visual">
            <div className="advisor-illustration">
              {/* Sleep Advisor Local Image */}
              <img src={advisorImg} alt="Luxury Mattress" className="main-img" />
              <div className="advisor-glow"></div>
              <div className="ai-badge-small">
                <div className="pulse-small"></div>
                AI Powered
              </div>
              <div className="floating-info card-info-1">
                 <span className="check">✓</span> Orthopedic Support
              </div>
              <div className="floating-info card-info-2">
                 <span className="check">✓</span> Better Sleep
              </div>
              <div className="floating-info card-info-3">
                 <span className="check">✓</span> Pressure Relief
              </div>
              <div className="floating-info card-info-4">
                 <span className="check">✓</span> AI Recommendation
              </div>
            </div>
          </div>

          <div className="advisor-content">
            <div className="section-header">
              <h2 className="brand-font">Dreamza Sleep Advisor</h2>
              <p>Answer a few smart questions and discover your ideal mattress and pillow combination.</p>
            </div>
            
            <div className="rec-box card">
              {recStep > 0 && recStep < 6 && (
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${(recStep / 5) * 100}%` }}></div>
                </div>
              )}

              {recStep === 0 && (
                <div className="rec-start text-center">
                  <div className="rec-icon">🤖</div>
                  <h3>Let's find your match</h3>
                  <p>Our AI will analyze your needs</p>
                  <button className="btn btn-primary" onClick={startRecommendation}>Start Now</button>
                </div>
              )}
              
              {recStep === 1 && (
                <div className="rec-step">
                  <span className="step-count">Question 1/5</span>
                  <h3>What are you looking for?</h3>
                  <div className="options-grid">
                    <button className="option-btn" onClick={() => handleRecAnswer('type', 'Mattress')}>
                      <span className="btn-icon">🛏️</span>
                      Mattress
                    </button>
                    <button className="option-btn" onClick={() => handleRecAnswer('type', 'Pillow')}>
                      <span className="btn-icon">☁️</span>
                      Pillow
                    </button>
                    <button className="option-btn" onClick={() => handleRecAnswer('type', 'Both')}>
                      <span className="btn-icon">✨</span>
                      Both
                    </button>
                  </div>
                </div>
              )}

              {recStep === 2 && (
                <div className="rec-step">
                  <span className="step-count">Question 2/5</span>
                  <h3>{recAnswers.type === 'Pillow' ? 'What issue are you facing?' : 'What is your main concern?'}</h3>
                  <div className="options-grid">
                    {recAnswers.type === 'Pillow' ? (
                      <>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Neck pain')}>Neck pain</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Cervical discomfort')}>Cervical discomfort</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Need soft comfort')}>Need soft comfort</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Need firm support')}>Need firm support</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Budget pillow')}>Budget pillow</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Everyday use')}>Everyday use</button>
                      </>
                    ) : (
                      <>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Back pain')}>Back pain</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Shoulder pain')}>Shoulder pain</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Hip/joint pain')}>Hip/joint pain</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Need hard mattress')}>Need hard mattress</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Need soft comfort')}>Need soft comfort</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Budget-friendly option')}>Budget-friendly option</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Guest/temporary use')}>Guest/temporary use</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Hostel/PG use')}>Hostel/PG use</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Small room/foldable need')}>Small room/foldable need</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'Elderly comfort')}>Elderly comfort</button>
                        <button className="option-btn" onClick={() => handleRecAnswer('concern', 'No specific pain')}>No specific pain</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {recStep === 3 && (
                <div className="rec-step">
                  <span className="step-count">Question 3/5</span>
                  <h3>What type of comfort do you prefer?</h3>
                  <div className="options-grid">
                    <button className="option-btn" onClick={() => handleRecAnswer('pref', 'Soft')}>Soft</button>
                    <button className="option-btn" onClick={() => handleRecAnswer('pref', 'Medium comfort')}>Medium comfort</button>
                    <button className="option-btn" onClick={() => handleRecAnswer('pref', 'Firm/Hard')}>Firm/Hard</button>
                  </div>
                </div>
              )}

              {recStep === 4 && (
                <div className="rec-step">
                  <span className="step-count">Question 4/5</span>
                  <h3>What is your approximate budget?</h3>
                  <div className="options-grid">
                    <button className="option-btn" onClick={() => handleRecAnswer('budget', 'Budget')}>Budget</button>
                    <button className="option-btn" onClick={() => handleRecAnswer('budget', 'Mid-range')}>Mid-range</button>
                    <button className="option-btn" onClick={() => handleRecAnswer('budget', 'Premium')}>Premium</button>
                  </div>
                </div>
              )}

              {recStep === 5 && (
                <div className="rec-step">
                  <span className="step-count">Question 5/5</span>
                  <h3>How will this product be used?</h3>
                  <div className="options-grid">
                    <button className="option-btn" onClick={() => handleRecAnswer('usage', 'Daily personal use')}>Daily personal use</button>
                    <button className="option-btn" onClick={() => handleRecAnswer('usage', 'Family use')}>Family use</button>
                    <button className="option-btn" onClick={() => handleRecAnswer('usage', 'Hotel/guest room')}>Hotel/guest room</button>
                    <button className="option-btn" onClick={() => handleRecAnswer('usage', 'Hostel/PG')}>Hostel/PG</button>
                    <button className="option-btn" onClick={() => handleRecAnswer('usage', 'Temporary use')}>Temporary use</button>
                  </div>
                </div>
              )}

              {recStep === 6 && recommendedProduct && (
                <div className="rec-result text-center">
                  <div className="success-badge">Perfect Match Found!</div>
                  <div className="result-card">
                     {/* Recommendation Result uses first image */}
                     <img src={recommendedProduct.images[0]} alt={recommendedProduct.name} />
                     <h3>{recommendedProduct.name}</h3>
                     <p className="rec-reason"><strong>Reason:</strong> {recommendedProduct.description}</p>
                     <div className="rec-details">
                        <p><strong>Comfort Type:</strong> {recommendedProduct.comfort}</p>
                        <p><strong>Best for:</strong> {recommendedProduct.bestFor}</p>
                     </div>
                     <div className="result-btns">
                        <a href={`${WHATSAPP_LINK}?text=Hi, Dreamza AI recommended ${recommendedProduct.name} for me. Type: ${recommendedProduct.category}`} className="btn btn-whatsapp">Order via WhatsApp</a>
                        <a href="#contact" className="btn btn-primary" onClick={() => setRecStep(0)}>Request Consultation</a>
                     </div>
                     <button className="btn-text" onClick={() => setRecStep(0)} style={{ marginTop: '20px', display: 'block', width: '100%', border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>Retake Quiz</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding">
        <div className="container">
          <div className="section-title text-center">
            <div className="badge">Our Services</div>
            <h2 className="brand-font">Professional Care</h2>
            <p>Beyond mattresses, we provide complete furniture care.</p>
          </div>
          <div className="services-grid">
            {services.map(s => (
              <div key={s.id} className="service-item card">
                <div className="s-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>Expert craftsmanship at your service.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Consultation Section */}
      <section id="contact" className="section-padding bg-soft expert-section">
        <div className="container">
          <div className="form-wrapper">
            <div className="expert-visual">
              <div className="expert-image-wrapper">
                {/* Consultation Local Image */}
                <img src={consultationImg} alt="Dreamza Support Advisor" className="expert-main-img" />
                <div className="consult-badge">Expert Consultation</div>
                <div className="whatsapp-visual">
                  <div className="wa-icon">💬</div>
                  <span>Instant Help</span>
                </div>
              </div>
              <div className="expert-info-text">
                <h2 className="brand-font">Personalized Advice</h2>
                <p>Not sure what to buy? Let our sleep experts guide you. Fill out the form and we'll contact you shortly.</p>
              </div>
            </div>
            
            <div className="form-container">
              {formSubmitted ? (
                <div className="form-success card">
                  <div className="success-icon">✨</div>
                  <h3>Thank you!</h3>
                  <p>Our Dreamza sleep expert will contact you shortly.</p>
                </div>
              ) : (
                <form className="lead-form card" onSubmit={handleFormSubmit}>
                  <h3 className="form-title">Inquiry Form</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleFormChange} placeholder="Enter your name" required />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} placeholder="10-digit number" required />
                      {phoneError && <p className="error-text">Please enter a valid 10-digit phone number</p>}
                    </div>
                    <div className="form-group">
                      <label>Product Interest</label>
                      <select name="selectedProduct" value={formData.selectedProduct} onChange={handleFormChange}>
                        <option value="">Select Product</option>
                        <option value="Mattress">Mattress</option>
                        <option value="Pillow">Pillow</option>
                        <option value="Sofa Repair">Sofa Repair</option>
                        <option value="Custom Order">Custom Order</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Mattress Size</label>
                      <input type="text" name="mattressSize" value={formData.mattressSize} onChange={handleFormChange} placeholder="e.g. 72x75" />
                    </div>
                    <div className="form-group">
                      <label>Approx. Budget</label>
                      <select name="budget" value={formData.budget} onChange={handleFormChange}>
                        <option value="">Select Budget</option>
                        <option value="Budget">Budget</option>
                        <option value="Mid-range">Mid-range</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                    <div className="form-group full">
                      <label>Sleep Issues/Pain</label>
                      <textarea name="sleepIssue" value={formData.sleepIssue} onChange={handleFormChange} placeholder="Describe your sleep issues" rows="3"></textarea>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Request Consultation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="section-padding bg-cream">
        <div className="container text-center">
          <div className="badge">Social Feed</div>
          <h2 className="brand-font">Follow Dreamza Journey</h2>
          <p>Get daily sleep tips and view our latest work.</p>
          <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="instagram-btn">
             @dreamza___
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="f-brand">
            <h2 className="brand-font">DREAMZA</h2>
            <p>Premium sleep solutions handcrafted with care for your well-being. Experience the art of sleeping.</p>
          </div>
          <div className="f-links">
            <h4>Explore</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#products">Products</a></li>
              <li><a href="#advisor">Sleep Advisor</a></li>
              <li><a href="#services">Services</a></li>
            </ul>
          </div>
          <div className="f-contact">
            <h4>Get in Touch</h4>
            <p>WhatsApp: +91 {WHATSAPP_NUMBER}</p>
            <div className="socials">
              <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Dreamza Mattress. Crafted for Excellence.</p>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href={WHATSAPP_LINK} className="floating-whatsapp" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" width="32" height="32"><path fill="white" d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793 0-.852.449-1.271.608-1.445.159-.175.348-.218.463-.218.116 0 .232.001.334.005.109.004.253-.04.397.304.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.182.225-.26.313-.087.087-.174.188-.072.362.101.174.449.741.964 1.201.666.594 1.229.779 1.403.865.174.087.275.072.377-.044.101-.116.435-.507.55-.68.116-.174.232-.145.391-.087.159.058 1.014.478 1.188.565.174.087.29.13.334.203.043.072.043.419-.101.824z"/></svg>
      </a>
    </div>
  );
}

export default App;
