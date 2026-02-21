"use client";

import React from "react";
import { motion } from "framer-motion";
import { FOCUS_AREAS } from "@/constants/focusAreas";

export const FocusAreasSection = () => {
  return (
    <section className="w-full bg-white py-20 lg:py-28">
      <div className="w-full max-w-[1920px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Five Focus Areas, One Mission
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ZAVN helps you achieve your goals across five key areas of life. 
            Whether you&apos;re looking to improve productivity, health, finances, learning, or relationships, 
            we&apos;ve got you covered.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {FOCUS_AREAS.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative bg-white rounded-2xl p-6 border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl"
            >
              {/* Gradient Background Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              <div className="relative">
                {/* Icon */}
                <div className="text-4xl mb-4">{area.icon}</div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {area.name}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {area.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

