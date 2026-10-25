import { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { getReviews, IMAGE_BASE } from '../services/api';

const defaultReviews = [
  { id: 1, name: "Sarah Johnson", role: "CEO, Tech Startup", rating: 5, comment: "IP Technology delivered an exceptional e-commerce platform that exceeded our expectations. The team was professional, responsive, and delivered on time." },
  { id: 2, name: "Michael Chen", role: "Marketing Director, Retail Company", rating: 5, comment: "Our new website has transformed our online presence. The mobile app they built is intuitive and our customers love it." },
  { id: 3, name: "Emily Rodriguez", role: "Product Manager, SaaS Company", rating: 5, comment: "Outstanding development work! They understood our complex requirements and delivered a scalable solution that grows with our business." },
  { id: 4, name: "David Kim", role: "Founder, Healthcare Startup", rating: 5, comment: "Professional team with excellent communication. They delivered our CRM system on budget and it works flawlessly." },
  { id: 5, name: "Lisa Thompson", role: "Operations Manager, Logistics Company", rating: 5, comment: "The custom dashboard they built has streamlined our operations. Incredible attention to detail and follow-up support." },
  { id: 6, name: "James Wilson", role: "CTO, FinTech Company", rating: 5, comment: "Technical excellence combined with business understanding. They delivered a complex financial application that our users love." }
];

const ReviewCard = ({ review, reviewIndex }) => {
  const [cardRef, cardVisible] = useScrollAnimation();
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-base transition-colors ${i < rating ? 'text-[#FFD700]' : 'text-border'}`}>
        ★
      </span>
    ));
  };
  return (
    <div
      className={`bg-bg border border-subtle rounded-xl p-6 transition-all duration-700 ease-out relative overflow-hidden group min-h-[220px] shadow-sm hover:border-primary hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
      ref={cardRef}
      style={{ transitionDelay: `${reviewIndex * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-x-full transition-transform duration-500 group-hover:translate-x-full"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-[1]">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base flex-shrink-0 border-2 border-surface shadow-sm overflow-hidden">
            {review.image && (review.image.includes('media.ipshopy.com') || review.image.startsWith('/uploads')) ? (
              <img 
                src={review.image.includes('media.ipshopy.com') ? review.image : `${IMAGE_BASE}${review.image}`}
                alt={review.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.outerHTML = `<span>${review.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>`; }}
              />
            ) : (
              review.name.split(' ').map(n => n[0]).join('').toUpperCase()
            )}
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <h4 className="text-sm md:text-base font-bold text-text break-all">{review.name}</h4>
            <p className="text-xs text-text-secondary break-all">{review.role}</p>
          </div>
        </div>
        <div className="flex gap-0.5 flex-shrink-0 pt-1">
          {renderStars(review.rating)}
        </div>
      </div>
      <div className="relative z-[1]">
        <p className="text-sm md:text-[15px] text-text-secondary leading-relaxed italic break-words">"{review.comment}"</p>
      </div>
    </div>
  );
};

const Reviews = () => {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [reviews, setReviews] = useState(defaultReviews);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getReviews()
      .then(data => {
        if (data && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch reviews:', err);
      });
  }, []);

  const reviewsPerSlide = 3;
  const slideCount = Math.ceil(reviews.length / reviewsPerSlide);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-surface py-12 md:py-16 overflow-hidden" id="reviews">
      <div className="container">
        <div className={`section-header ${headerVisible ? 'visible' : ''}`} ref={headerRef}>
          <h2 className="text-[28px] md:text-[32px] font-bold mb-4 bg-gradient-to-br from-text to-text-secondary bg-clip-text text-transparent">Client Reviews & Testimonials</h2>
          <p className="text-base md:text-lg text-text-secondary max-w-[600px] mx-auto">Don't just take our word for it - see what our satisfied clients have to say about our work</p>
        </div>
        
        <div className="relative flex items-center gap-4 my-10 md:my-12 px-0">
          <button 
            className="hidden md:flex absolute left-[-24px] top-1/2 -translate-y-1/2 bg-primary text-white border-none rounded-full w-12 h-12 items-center justify-center text-xl cursor-pointer transition-all z-10 shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-110 active:scale-95" 
            onClick={handlePrev}
            aria-label="Previous reviews"
          >
            ←
          </button>
          
          <div className="flex-1 overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: slideCount }, (_, slideIndex) => (
                <div key={slideIndex} className="min-w-full grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
                  {reviews.slice(
                    slideIndex * reviewsPerSlide,
                    slideIndex * reviewsPerSlide + reviewsPerSlide
                  ).map((review, reviewIndex) => (
                    <ReviewCard key={review.id || `${slideIndex}-${reviewIndex}`} review={review} reviewIndex={reviewIndex} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="hidden md:flex absolute right-[-24px] top-1/2 -translate-y-1/2 bg-primary text-white border-none rounded-full w-12 h-12 items-center justify-center text-xl cursor-pointer transition-all z-10 shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-110 active:scale-95" 
            onClick={handleNext}
            aria-label="Next reviews"
          >
            →
          </button>
        </div>
        
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: slideCount }, (_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all hover:bg-text-tertiary ${index === currentIndex ? 'bg-primary scale-125' : 'bg-border'}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};


export default Reviews;
