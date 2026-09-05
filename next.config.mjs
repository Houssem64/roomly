/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Les photos des biens sont stockées dans public/uploads : aucun réglage
    // n'est nécessaire pour elles. On n'autorise ici que les avatars Google,
    // seul cas d'image encore hébergée à l'extérieur.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
