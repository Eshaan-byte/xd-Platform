import React from "react";

const mockLibrary = [
  { id: 1, title: "NFS Unbound", cover: "/images/games/nfs-unbound.jpg" },
  { id: 2, title: "Red Dead Redemption II", cover: "/images/games/rdr2.jpg" },
  { id: 3, title: "Deus Ex: Human Revolution", cover: "/images/games/deus-ex.jpg" },
  { id: 4, title: "Bloodlines 2", cover: "/images/games/bloodlines2.jpg" },
  { id: 5, title: "Resident EVIL 3", cover: "/images/games/re3.jpg" },
  { id: 6, title: "Alan Wake II", cover: "/images/games/alanwake2.jpg" },
  { id: 7, title: "Chivalry 2", cover: "/images/games/chivalry2.jpg" },
  { id: 8, title: "Rocket League", cover: "/images/games/rocket-league.jpg" },
];

const Library: React.FC = () => {
  return (
    <>
      <h1 className="mb-4 text-lg font-semibold">Library</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {mockLibrary.map((g) => (
          <article key={g.id} className="overflow-hidden rounded-xl bg-[#111] ring-1 ring-white/5">
            <img src={g.cover} alt={g.title} className="h-48 w-full object-cover" />
            <div className="px-3 py-2 text-sm">{g.title}</div>
          </article>
        ))}
      </div>
    </>
  );
};

export default Library;
