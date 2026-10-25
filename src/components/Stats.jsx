import { useState, useEffect, useRef } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { getAnalytics } from '../services/api';
import { FolderKanban, Users, MapPin, Calendar } from 'lucide-react';

const DEFAULT_ANALYTICS = {
  projectsCount: '150+',
  clientsCount: '50+',
  statesCount: '15+'
};

// Counter animation hook
const useCountUp = (end, duration = 2000, shouldStart = false) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!shouldStart || hasAnimated.current) return;
    
    hasAnimated.current = true;
    let startTime;
    const endValue = parseInt(end);
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * endValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, shouldStart]);

  return count;
};

const Stats = () => {
  const [statsRef, statsVisible] = useScrollAnimation();
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);

  useEffect(() => {
    getAnalytics()
      .then(data => {
        if (data) {
          setAnalytics({
            projectsCount: data.projectsCount || '150+',
            clientsCount: data.clientsCount || '50+',
            statesCount: data.statesCount || '15+'
          });
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      number: analytics.projectsCount,
      label: "Projects",
      icon: FolderKanban
    },
    {
      number: analytics.clientsCount,
      label: "Clients",
      icon: Users
    },
    {
      number: analytics.statesCount,
      label: "States",
      icon: MapPin
    },
    {
      number: "5+",
      label: "Years",
      icon: Calendar
    }
  ];

  return (
    <div className={`py-12 md:py-16 transition-all duration-1000 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`} ref={statsRef}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-10 md:pt-12 border-t border-subtle">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            // Extract number and suffix (like +)
            const numberMatch = stat.number.match(/(\d+)(\+?)/);
            const targetNumber = numberMatch ? parseInt(numberMatch[1]) : 0;
            const suffix = numberMatch ? numberMatch[2] : '';
            const animatedCount = useCountUp(targetNumber, 2000, statsVisible);
            
            return (
              <div key={index} className="text-center group">
                {/* Icon and Number on same line */}
                <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-primary transition-transform group-hover:scale-110" />
                  <span className="text-3xl md:text-5xl font-semibold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent transition-transform group-hover:scale-110">
                    {animatedCount}{suffix}
                  </span>
                </div>
                {/* Label below */}
                <div className="text-sm md:text-base font-medium text-text">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>

  );
};

export default Stats;
