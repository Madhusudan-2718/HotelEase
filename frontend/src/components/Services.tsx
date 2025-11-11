import { Sparkles, UtensilsCrossed, Plane, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './ImageWFB/ImageWithFallback';

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  color: string;
}

interface ServicesProps {
  onNavigate?: (page: 'home' | 'housekeeping' | 'restaurant' | 'travel') => void;
}

export function Services({ onNavigate }: ServicesProps = {}) {
  const services: Service[] = [
    {
      id: 'housekeeping',
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Housekeeping',
      description:
        'Immaculate room service and maintenance ensuring your comfort and cleanliness throughout your stay.',
      image: '/src/public/images/housekeeping.png',
      color: '#6B8E23',
    },
    {
      id: 'restaurant',
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: 'Restaurant',
      description:
        'Savor exquisite culinary experiences with our world-class dining options featuring local and international cuisines.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjIzOTQ4MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      color: '#FFD700',
    },
    {
      id: 'travel',
      icon: <Plane className="w-8 h-8" />,
      title: 'Travel Desk',
      description:
        'Expert travel assistance and concierge services to help you explore and make the most of your destination.',
      image: 'https://images.unsplash.com/photo-1759038085950-1234ca8f5fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBjb25jaWVyZ2UlMjBkZXNrfGVufDF8fHx8MTc2MjQ0NjIwNnww&ixlib=rb-4.1.0&q=80&w=1080',
      color: '#6B8E23',
    },
  ];

  return (
    <section id="services" className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-4 inline-block">
            <span
              className="text-[#6B8E23] font-poppins tracking-widest uppercase"
              style={{ fontSize: '0.875rem', fontWeight: 500 }}
            >
              Our Services
            </span>
          </div>
          <h2
            className="text-[#2D2D2D] font-playfair mb-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}
          >
            Exceptional Hospitality Services
          </h2>
          <p
            className="text-[#2D2D2D]/70 max-w-2xl mx-auto font-poppins"
            style={{ fontSize: '1.125rem', fontWeight: 300 }}
          >
            We offer a comprehensive range of services designed to exceed your expectations
            and make your stay truly memorable.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.id}
              className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                ></div>
                <div
                  className="absolute top-4 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: service.color }}
                >
                  <div className="text-white">{service.icon}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3
                  className="text-[#2D2D2D] font-playfair mb-3"
                  style={{ fontSize: '1.5rem', fontWeight: 600 }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-[#2D2D2D]/70 mb-6 font-poppins"
                  style={{ fontSize: '0.9375rem', fontWeight: 300 }}
                >
                  {service.description}
                </p>
                <Button
                  variant="ghost"
                  className="group/btn p-0 h-auto hover:bg-transparent text-[#6B8E23] hover:text-[#FFD700] transition-colors"
                  onClick={() => {
                    if (service.id === 'housekeeping') onNavigate?.('housekeeping');
                    else if (service.id === 'restaurant') onNavigate?.('restaurant');
                    else if (service.id === 'travel') onNavigate?.('travel');
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 600 }}>
                    {['housekeeping', 'restaurant', 'travel'].includes(service.id) ? 'Get Started' : 'Learn More'}
                  </span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#6B8E23] to-[#6B8E23]/80 rounded-2xl p-12 shadow-xl">
            <h3
              className="text-white font-playfair mb-4"
              style={{ fontSize: '2rem', fontWeight: 600 }}
            >
              Ready to Experience Luxury?
            </h3>
            <p
              className="text-white/90 mb-6 font-poppins"
              style={{ fontSize: '1.125rem', fontWeight: 300 }}
            >
              Book your stay with us and discover what true hospitality means.
            </p>
            <Button className="bg-[#FFD700] text-[#2D2D2D] hover:bg-[#FFD700]/90 px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-all">
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>Book Now</span>
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
}
