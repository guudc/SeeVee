export type CVData = {
  name: string;
  summary: string;
  skills: string[];
  phone: string;
  email: string;
  location: string;
  socials: { platform: string; handle: string }[];
  education: { degree: string; school: string; location: string; date: string }[];
  experience: { title: string; company: string; location: string; date: string; bullets: string[] }[];
  hobbies?: string[];
  references?: { name: string; contact: string; relationship: string }[];
  themeColor: string;
};

export const DEFAULT_CV_DATA: CVData = {
  name: "AMADASUN GOODNESS",
  summary: "Results-driven Full-Stack Developer with a strong foundation in Blockchain technology. Proficient in designing and building scalable frontend applications with React and Tailwind CSS, and robust backend systems using Node.js and RESTful APIs. Adept at integrating complex blockchain functionalities into user-friendly web applications, with a proven track record of enhancing performance, security, and user experience.",
  skills: [
    "Frontend: React.js, Next.js, TailwindCSS, HTML5, CSS3, Responsive UI/UX",
    "Backend: Node.js, Express.js, REST APIs, Database Design, Server Optimization",
    "Blockchain: Solidity, Smart Contracts, NFT Standards, Web3.js, Cross-Chain Development",
    "Security: Smart Contract Security, Auditing, Vulnerability Mitigation",
    "Tools & DevOps: Git, GitHub, Version Control, API Integration, CI/CD Basics",
    "Other Skills: Scalability Solutions, Problem-Solving, Technical Documentation, Continuous Learning"
  ],
  phone: "+234 814-663-4078",
  email: "goodcsmart@gmail.com",
  location: "Lagos, Nigeria",
  socials: [],
  education: [
    {
      degree: "Bachelor of Engineering: Computer Engineering",
      school: "University of Benin",
      location: "Benin city, Edo State, Nigeria",
      date: "2015 to 2021"
    }
  ],
  experience: [
    {
      title: "Full-Stack & Blockchain Developer",
      company: "Luxen Labs",
      location: "Remote",
      date: "2024 - 2025",
      bullets: [
        "Engineered and maintained scalable backend services using Node.js to support core application features and database interactions.",
        "Developed responsive and modern user interfaces with React and Tailwind CSS, ensuring a seamless cross-platform user experience.",
        "Designed, built, and optimized RESTful APIs to facilitate efficient data flow between the frontend, backend, and blockchain networks.",
        "Integrated blockchain smart contracts into web applications using Web3.js, enabling decentralized functionalities for users.",
        "Collaborated in an Agile team to deliver full-stack features from concept to deployment, improving application performance and scalability."
      ]
    }
  ],
  themeColor: "#0d9488", // Teal-600
};
