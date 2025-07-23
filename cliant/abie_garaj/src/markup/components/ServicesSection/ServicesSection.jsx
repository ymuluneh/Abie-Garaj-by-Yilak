import React from "react";

// --- ServicesSection Component ---
// This component displays a grid of services offered by the garage.
// Each service includes an icon (inline SVG), a title, and a brief description.
// Hover effects are added to the service cards for better user interaction.
const services = [
  {
    // Icon for Engine Repair (a car)
    icon: (
      <svg
        style={{ width: "1em", height: "1em" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.92 2c-.2-.04-.4-.06-.6-.06H5.68c-.2 0-.4.02-.6.06C4.4 2.15 4 2.62 4 3.25V19c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h10v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V3.25c0-.63-.4-1.1-1.08-1.25zM6.5 17c-.83 0-1.5-.67-1.5-1.5S5.67 14 6.5 14s1.5.67 1.5 1.5S7.33 17 6.5 17zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 14 17.5 14s1.5.67 1.5 1.5S18.33 17 17.5 17zM5 12V6h14v6H5z" />
      </svg>
    ),
    title: "Engine Repair",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    // Icon for Transmission Repair (tools)
    icon: (
      <svg
        style={{ width: "1em", height: "1em" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5.1-1.4-6.9-1.8-1.8-4.6-2.3-6.9-1.4l-9.1-9.1c-.2-.2-.5-.3-.7-.3s-.5.1-.7.3l-1.4 1.4c-.4.4-.4 1 0 1.4l9.1 9.1c-2.3-.9-5.1-.4-6.9 1.4-1.8 1.8-2.3 4.6-1.4 6.9l-9.1 9.1c-.4.4-.4 1 0 1.4l1.4 1.4c.2.2.5.3.7.3s.5-.1.7-.3l9.1-9.1c.9 2.3.4 5.1-1.4 6.9-1.8 1.8-4.6 2.3-6.9 1.4l-9.1 9.1c-.4.4-.4 1 0 1.4l1.4 1.4c.2.2.5.3.7.3s.5-.1.7-.3L19 22.7c.4-.4 1-.4 1.4 0l1.4-1.4c.4-.4.4-1 0-1.4z" />
      </svg>
    ),
    title: "Transmission Repair",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    // Icon for Brake Repair (wrench)
    icon: (
      <svg
        style={{ width: "1em", height: "1em" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20 2c-1.1 0-2 .9-2 2v2h-2V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-2V4c0-1.1-.9-2-2-2zm-2 16H4V8h16v10zM12 9c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
      </svg>
    ),
    title: "Brake Repair",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    // Icon for Oil Change (oil can)
    icon: (
      <svg
        style={{ width: "1em", height: "1em" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9H9v2h2v-2zm0 4H9v2h2v-2zm4-4h-2v2h2v-2zm0 4h-2v2h2v-2z" />
      </svg>
    ),
    title: "Oil Change",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    // Icon for Tire Service & Repair (a car again, as FaTire is not available)
    icon: (
      <svg
        style={{ width: "1em", height: "1em" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.92 2c-.2-.04-.4-.06-.6-.06H5.68c-.2 0-.4.02-.6.06C4.4 2.15 4 2.62 4 3.25V19c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h10v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V3.25c0-.63-.4-1.1-1.08-1.25zM6.5 17c-.83 0-1.5-.67-1.5-1.5S5.67 14 6.5 14s1.5.67 1.5 1.5S7.33 17 6.5 17zm11 0c-.83 0-1.5-.67-1.5-1.5S16.67 14 17.5 14s1.5.67 1.5 1.5S18.33 17 17.5 17zM5 12V6h14v6H5z" />
      </svg>
    ),
    title: "Tire Service & Repair",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    // Icon for Dent & Painting (paint brush)
    icon: (
      <svg
        style={{ width: "1em", height: "1em" }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41zm-3.09 3.09L3.25 19.92c-.39.39-.39 1.02 0 1.41L4.66 22c.39.39 1.02.39 1.41 0L20.71 8.34c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0z" />
      </svg>
    ),
    title: "Dent & Painting",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];

const ServicesSection = () => {
  const styles = {
    servicesSection: {
      backgroundColor: "var(--light-gray-bg)",
      padding: "var(--spacing-xl) 0",
      textAlign: "center",
    },
    sectionTitle: {
      fontSize: "2.8em",
      marginBottom: "var(--spacing-xl)",
      color: "var(--heading-color)",
      // Media queries are handled by global CSS classes for better compatibility
      // with inline styles in this environment.
    },
    serviceGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "var(--spacing-md)",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 var(--spacing-md)",
    },
    serviceCard: {
      backgroundColor: "var(--white-color)",
      padding: "var(--spacing-lg)",
      borderRadius: "8px",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.3s ease, boxShadow 0.3s ease", // Corrected to camelCase
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    },
    serviceCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    },
    iconWrapper: {
      fontSize: "3em",
      color: "var(--primary-color)",
      marginBottom: "var(--spacing-md)",
      backgroundColor: "var(--light-gray-bg)",
      borderRadius: "50%",
      width: "80px",
      height: "80px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "inset 0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    cardTitle: {
      fontSize: "1.5em",
      marginBottom: "var(--spacing-sm)",
      color: "var(--heading-color)",
    },
    cardDescription: {
      fontSize: "0.95em",
      color: "var(--text-color)",
      lineHeight: "1.7",
      flexGrow: 1,
    },
    readMoreLink: {
      marginTop: "var(--spacing-md)",
      color: "var(--primary-color)",
      fontWeight: "bold",
    },
    readMoreLinkHover: {
      textDecoration: "underline",
    },
  };

  return (
    <section style={styles.servicesSection}>
      <div style={styles.container} className="container">
        <h2 style={styles.sectionTitle}>Our Services</h2>
        <div style={styles.serviceGrid}>
          {services.map((service, index) => (
            <div
              key={index}
              style={styles.serviceCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform =
                  styles.serviceCardHover.transform;
                e.currentTarget.style.boxShadow =
                  styles.serviceCardHover.boxShadow;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div style={styles.iconWrapper}>{service.icon}</div>
              <h3 style={styles.cardTitle}>{service.title}</h3>
              <p style={styles.cardDescription}>{service.description}</p>
              <a
                href="#"
                style={styles.readMoreLink}
                onMouseOver={(e) =>
                  (e.currentTarget.style.textDecoration =
                    styles.readMoreLinkHover.textDecoration)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.textDecoration = "none")
                }
              >
                Read More &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
