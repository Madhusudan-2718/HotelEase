import { Star, Quote } from 'lucide-react';
import { Card } from './ui/card';
import { ImageWithFallback } from './ImageWFB/ImageWithFallback';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Business Traveler',
      content:
        'HotelEase exceeded all my expectations. The housekeeping service was impeccable, and the restaurant served the most delicious meals. Highly recommend!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'Family Vacation',
      content:
        'The travel desk helped us plan an amazing itinerary. The staff was incredibly helpful and made our stay memorable. Will definitely return!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      role: 'Weekend Getaway',
      content:
        'Luxurious rooms, excellent service, and fantastic dining options. HotelEase truly offers a premium experience at great value.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-4 inline-block">
            <span
              className="text-[#6B8E23] font-poppins tracking-widest uppercase"
              style={{ fontSize: '0.875rem', fontWeight: 500 }}
            >
              Testimonials
            </span>
          </div>
          <h2
            className="text-[#2D2D2D] font-playfair mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}
          >
            What Our Guests Say
          </h2>
          <p
            className="text-[#2D2D2D]/70 max-w-2xl mx-auto font-poppins"
            style={{ fontSize: '1.125rem', fontWeight: 300 }}
          >
            Don't just take our word for it - hear from our satisfied guests about their
            experiences at HotelEase.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-[#F5F5F5] p-8"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="w-16 h-16 text-[#6B8E23]" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                ))}
              </div>

              {/* Content */}
              <p
                className="text-[#2D2D2D]/80 mb-6 font-poppins relative z-10"
                style={{ fontSize: '0.9375rem', fontWeight: 300, lineHeight: 1.7 }}
              >
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4
                    className="text-[#2D2D2D] font-poppins"
                    style={{ fontSize: '1rem', fontWeight: 600 }}
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    className="text-[#2D2D2D]/60 font-poppins"
                    style={{ fontSize: '0.875rem', fontWeight: 400 }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#6B8E23] font-playfair">500+</div>
            <p className="text-sm text-gray-600 font-poppins">Happy Guests</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#6B8E23] font-playfair">50+</div>
            <p className="text-sm text-gray-600 font-poppins">Luxury Rooms</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#6B8E23] font-playfair">4.9</div>
            <p className="text-sm text-gray-600 font-poppins">Average Rating</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#6B8E23] font-playfair">24/7</div>
            <p className="text-sm text-gray-600 font-poppins">Guest Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
