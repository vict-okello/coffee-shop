import React from 'react';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';
import icon4 from '../assets/icon4.png';
import icon5 from '../assets/icon5.png';

function HomeService() {
  const services = [
    { title: "Equipment", icon: icon1 },
    { title: "Type Of Coffee", icon: icon2 },
    { title: "Take A Way", icon: icon3 },
    { title: "Beans Variant", icon: icon4 },
    { title: "Pastry", icon: icon5 },
  ];

  return (
    <section className="bg-[#1D1212] py-24 px-4 flex flex-col items-center">
      <h1 className="text-4xl text-white md:text-5xl font-serif mb-12">Service</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-[#54372A] rounded-2xl flex flex-col items-center justify-center p-6 md:p-8 transition-transform hover:scale-105"
          >
            <img src={service.icon} className="w-12 md:w-16 mb-4" alt={service.title} />
            <p className="text-[#f8e3c1] text-sm md:text-base text-center">{service.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomeService;
