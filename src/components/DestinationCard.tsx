import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Destination } from '../data/destinations';
import { formatINR } from '../data/destinations';

export const DestinationCard: React.FC<{ d: Destination }> = ({ d }) => {
  return (
    <Link
      to={`/destinations/${d.slug}`}
      className="group relative block overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-elegant"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={d.image}
          alt={d.name}
          loading="lazy"
          width={1280}
          height={864}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <p className="text-xs uppercase tracking-widest opacity-80">{d.region}</p>
        <h3 className="mt-1 text-2xl font-bold">{d.name}</h3>
        <div className="mt-3 flex items-end justify-between">
          <p className="text-sm opacity-90">
            From <span className="text-lg font-bold">{formatINR(d.price)}</span>/person
          </p>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0B5ED7] shadow transition-transform group-hover:rotate-45 shrink-0">
            <ArrowUpRight className="h-5 w-5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
