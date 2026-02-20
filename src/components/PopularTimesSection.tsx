import { Clock } from "lucide-react";

const timeData = [
  { hour: "9AM", value: 20 },
  { hour: "10AM", value: 40 },
  { hour: "11AM", value: 70 },
  { hour: "12PM", value: 85 },
  { hour: "1PM", value: 60 },
  { hour: "2PM", value: 45 },
  { hour: "3PM", value: 75 },
  { hour: "4PM", value: 90 },
  { hour: "5PM", value: 95 },
  { hour: "6PM", value: 70 },
  { hour: "7PM", value: 40 },
  { hour: "8PM", value: 15 },
];

const PopularTimesSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Radial gold accent */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5"
        style={{
          background: "radial-gradient(circle, hsl(43 74% 49%) 0%, transparent 70%)",
        }}
      />
      
      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/30 text-primary font-body text-sm mb-4">
            <Clock className="w-4 h-4" />
            Plan Your Visit
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Popular <span className="text-gold-gradient">Times</span>
          </h2>
          <p className="font-body text-muted-foreground mt-4">Saturday - Busiest Day</p>
        </div>
        
        {/* Arc-style chart */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Curved container */}
            <div 
              className="glass-card p-8 md:p-12"
              style={{
                borderRadius: "30% 30% 5% 5% / 20% 20% 5% 5%",
              }}
            >
              {/* Bar chart with curved perspective */}
              <div className="flex items-end justify-center gap-2 md:gap-4 h-64 md:h-80">
                {timeData.map((item, index) => {
                  const isCurrentHour = index === 8; // 5PM as example current time
                  return (
                    <div key={item.hour} className="flex flex-col items-center gap-2 group">
                      {/* Bar */}
                      <div
                        className={`w-6 md:w-10 rounded-t-full transition-all duration-500 group-hover:scale-110 ${
                          isCurrentHour 
                            ? "bg-gradient-to-t from-primary to-gold-light animate-glow" 
                            : "bg-gradient-to-t from-primary/40 to-primary/70 group-hover:from-primary/60 group-hover:to-primary"
                        }`}
                        style={{
                          height: `${item.value * 2.5}px`,
                          transform: `perspective(500px) rotateX(${5 - Math.abs(index - 5.5) * 0.5}deg)`,
                        }}
                      />
                      {/* Label */}
                      <span className={`font-body text-xs md:text-sm ${isCurrentHour ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                        {item.hour}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Current status */}
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  <span className="font-body text-foreground">Currently: <strong className="text-primary">Usually Busy</strong></span>
                </div>
              </div>
            </div>
            
            {/* Decorative corner elements */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary/50 rounded-tl-xl" />
            <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-primary/50 rounded-tr-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularTimesSection;
